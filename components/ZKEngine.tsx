import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { View } from 'react-native';
import { BridgeRequest, BridgeResponse, ZKProofPayload } from '../lib/zk-bridge-types';

interface ZKContextType {
  execute: (type: BridgeRequest['type'], payload: any) => Promise<any>;
  status: 'offline' | 'initializing' | 'ready' | 'proving' | 'error';
}

const ZKContext = createContext<ZKContextType | null>(null);

export const useZKEngine = () => {
  const context = useContext(ZKContext);
  if (!context) {
    throw new Error('useZKEngine must be used within a ZKProvider');
  }
  return context;
};

export const ZKProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const webViewRef = useRef<WebView>(null);
  const [status, setStatus] = useState<ZKContextType['status']>('initializing');
  const [injectedJS, setInjectedJS] = useState({ snarkjs: '', poseidon: '' });

  // Resolvers map: ID -> { resolve, reject }
  const resolvers = useRef<Record<string, { resolve: (val: any) => void; reject: (err: any) => void }>>({});

  // Load bundled assets
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const snarkjsAsset = Asset.fromModule(require('../assets/snarkjs.bundle'));
        const poseidonAsset = Asset.fromModule(require('../assets/poseidon.bundle'));

        await Promise.all([snarkjsAsset.downloadAsync(), poseidonAsset.downloadAsync()]);

        if (!snarkjsAsset.localUri || !poseidonAsset.localUri) {
          throw new Error("Failed to resolve local URIs for ZK assets");
        }

        const snarkjsContent = await FileSystem.readAsStringAsync(snarkjsAsset.localUri);
        const poseidonContent = await FileSystem.readAsStringAsync(poseidonAsset.localUri);

        console.log(`[ZKEngine] Asset sizes - SnarkJS: ${snarkjsContent.length}, Poseidon: ${poseidonContent.length}`);

        setInjectedJS({ snarkjs: snarkjsContent, poseidon: poseidonContent });
        setStatus('ready');
      } catch (e) {
        console.error("Failed to load ZK assets", e);
        setStatus('error');
      }
    };
    loadAssets();
  }, []);

  const execute = (type: BridgeRequest['type'], payload: any): Promise<any> => {
    if (type === 'GENERATE_PROOF') setStatus('proving');

    const id = Math.random().toString(36).substring(7);
    return new Promise((resolve, reject) => {
      // 45s timeout for heavy proofs
      const timeout = setTimeout(() => {
        delete resolvers.current[id];
        if (type === 'GENERATE_PROOF') setStatus('ready'); // Reset status on timeout
        reject(new Error('ZK Request Timed Out (45s)'));
      }, 45000);

      resolvers.current[id] = {
        resolve: (val) => {
          clearTimeout(timeout);
          if (type === 'GENERATE_PROOF') setStatus('ready');
          resolve(val);
        },
        reject: (err) => {
          clearTimeout(timeout);
          if (type === 'GENERATE_PROOF') setStatus('error');
          reject(err);
        }
      };

      const request: BridgeRequest = { id, type, payload } as BridgeRequest; // Type assertion to match discriminated union

      console.log(`[ZKEngine v2] Request: ${type} (${id})`);
      if (status !== 'initializing' && status !== 'error' && webViewRef.current) {
        console.log(`[ZKEngine] Calling Bridge: ${id}`);
        const callCode = `window.zkBridgeExecute('${JSON.stringify(request)}'); true;`;
        webViewRef.current.injectJavaScript(callCode);
      } else {
        reject(new Error(`ZK Engine not ready (Status: ${status})`));
      }
    });
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const response: BridgeResponse = JSON.parse(event.nativeEvent.data);

      // Handle Logs & Progress
      if (response.type === 'LOG') {
        console.log(`[ZK-WebView] ${response.payload}`);
        return;
      }

      const resolver = resolvers.current[response.id];
      if (!resolver) return;

      if (response.type === 'RESULT') {
        resolver.resolve(response.payload);
      } else if (response.type === 'ERROR') {
        resolver.reject(new Error(response.payload));
      }

      delete resolvers.current[response.id];
    } catch (err) {
      console.error('[ZKEngine] Failed to parse message:', err);
    }
  };

  // Injection logic
  const injectScripts = () => {
    if (!webViewRef.current || !injectedJS.snarkjs) return;

    console.log('[ZKEngine] Triggering Script Injection...');

    const bridgeCode = `
      // 1. Error Trapping & Console Forwarding
      window.onerror = function(message, source, lineno, colno, error) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'LOG', 
          payload: 'WebView Error: ' + message + ' at ' + lineno + ':' + colno
        }));
      };
      const oldLog = console.log;
      console.log = (...args) => {
         oldLog(...args);
         window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOG', payload: args.join(' ') }));
      };

      // 2. Global Bridge Function (Direct Call)
      window.zkBridgeExecute = async (requestStr) => {
        try {
          const { id, type, payload } = JSON.parse(requestStr);
          console.log("Bridge Executing: " + type + " (" + id + ")");
          
          if (type === 'POSEIDON_HASH') {
            if (typeof poseidon === 'undefined') throw new Error('Poseidon library not loaded');
            const inputs = payload.map((i) => BigInt(i));
            const hash = poseidon(inputs);
            window.ReactNativeWebView.postMessage(JSON.stringify({
              id, type: 'RESULT', payload: hash.toString()
            }));
          } else if (type === 'GENERATE_PROOF') {
            if (typeof snarkjs === 'undefined') throw new Error('SnarkJS library not loaded');
            const { inputs, wasmB64, zkeyB64 } = payload;
            const wasm = Uint8Array.from(atob(wasmB64), c => c.charCodeAt(0));
            const zkey = Uint8Array.from(atob(zkeyB64), c => c.charCodeAt(0));

            console.log('Starting Groth16 Proof...');
            const { proof, publicSignals } = await snarkjs.groth16.fullProve(inputs, wasm, zkey);
            window.ReactNativeWebView.postMessage(JSON.stringify({
              id, type: 'RESULT', payload: { proof, publicSignals }
            }));
          }
        } catch (err) {
          console.log("Bridge Error: " + err.toString());
          try {
            const { id } = JSON.parse(requestStr);
            window.ReactNativeWebView.postMessage(JSON.stringify({
              id, type: 'ERROR', payload: err.toString()
            }));
          } catch(e) {}
        }
      };

      // 3. Inject Libraries
      try {
        ${injectedJS.snarkjs}
        ${injectedJS.poseidon}
        console.log("Libraries Loaded. snarkjs: " + typeof snarkjs + ", poseidon: " + typeof poseidon);
        console.log("ZK Engine Fully Ready (v5)");
      } catch (e) {
        console.log("Library Injection Failed: " + e.toString());
      }
      true;
    `;

    webViewRef.current.injectJavaScript(bridgeCode);
  };

  // Trigger injection when EITHER assets or webview is ready
  useEffect(() => {
    if (status === 'ready' && webViewRef.current) {
      injectScripts();
    }
  }, [status, injectedJS.snarkjs]);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="background: #1a1b26;">
         <h1 style="color: grey; font-size: 8px;">ZK: ${status}</h1>
      </body>
    </html>
  `;

  return (
    <ZKContext.Provider value={{ execute, status }}>
      {children}
      <View style={{ height: 0, width: 0, opacity: 0, position: 'absolute' }}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html }}
          onMessage={handleMessage}
          onLoad={() => {
            console.log('[ZKEngine] WebView Component onLoad');
            if (status === 'ready') injectScripts();
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </ZKContext.Provider>
  );
};
