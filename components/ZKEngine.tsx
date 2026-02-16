import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { View } from 'react-native';

interface ZKRequest {
  id: string;
  type: 'POSEIDON_HASH' | 'GENERATE_PROOF';
  payload: any;
}

interface ZKResponse {
  id: string;
  type: 'RESULT' | 'ERROR';
  payload: any;
}

interface ZKContextType {
  execute: (type: ZKRequest['type'], payload: any) => Promise<any>;
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
  const [isReady, setIsReady] = useState(false);
  const resolvers = useRef<Record<string, { resolve: (val: any) => void; reject: (err: any) => void }>>({});

  const execute = (type: ZKRequest['type'], payload: any): Promise<any> => {
    const id = Math.random().toString(36).substring(7);
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        delete resolvers.current[id];
        reject(new Error('ZK Request Timed Out (20s) - Low Network?'));
      }, 20000);

      resolvers.current[id] = {
        resolve: (val) => { clearTimeout(timeout); resolve(val); },
        reject: (err) => { clearTimeout(timeout); reject(err); }
      };
      const request: ZKRequest = { id, type, payload };

      console.log(`[ZKEngine] Primary Request: ${type} (${id})`);
      webViewRef.current?.postMessage(JSON.stringify(request));
    });
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const response: ZKResponse = JSON.parse(event.nativeEvent.data);
      const resolver = resolvers.current[response.id];

      if (!resolver) return;

      if (response.type === 'RESULT') {
        resolver.resolve(response.payload);
      } else {
        resolver.reject(new Error(response.payload));
      }

      delete resolvers.current[response.id];
    } catch (err) {
      console.error('[ZKEngine] Failed to parse message:', err);
    }
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/snarkjs/0.7.6/snarkjs.min.js" onerror="window.ReactNativeWebView.postMessage(JSON.stringify({id: 'SYSTEM', type: 'ERROR', payload: 'Failed to load snarkjs (CDN blocked)'}))"></script>
        <script src="https://cdn.jsdelivr.net/npm/poseidon-lite@0.2.0/poseidon.js" onerror="window.ReactNativeWebView.postMessage(JSON.stringify({id: 'SYSTEM', type: 'ERROR', payload: 'Failed to load poseidon (CDN blocked)'}))"></script>
        <script>
          // Bridge logic
          window.addEventListener('message', async (event) => {
            const { id, type, payload } = JSON.parse(event.data);
            
            try {
              if (type === 'POSEIDON_HASH') {
                const inputs = payload.map(i => BigInt(i));
                const hash = poseidon(inputs);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  id, type: 'RESULT', payload: hash.toString()
                }));
              } else if (type === 'GENERATE_PROOF') {
                const { inputs, wasmB64, zkeyB64 } = payload;
                
                // Convert Base64 back to Uint8Array
                const wasm = Uint8Array.from(atob(wasmB64), c => c.charCodeAt(0));
                const zkey = Uint8Array.from(atob(zkeyB64), c => c.charCodeAt(0));

                const { proof, publicSignals } = await snarkjs.groth16.fullProve(
                  inputs,
                  wasm,
                  zkey
                );

                window.ReactNativeWebView.postMessage(JSON.stringify({
                  id, type: 'RESULT', payload: { proof, publicSignals }
                }));
              }
            } catch (err) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                id, type: 'ERROR', payload: err.message
              }));
            }
          });
        </script>
      </head>
      <body style="background: transparent;">
        <h1 style="color: white; font-size: 10px;">ZK Engine Active</h1>
      </body>
    </html>
  `;

  return (
    <ZKContext.Provider value={{ execute }}>
      {children}
      <View style={{ height: 0, width: 0, opacity: 0, position: 'absolute' }}>
        <WebView
          ref={webViewRef}
          source={{ html }}
          onMessage={handleMessage}
          onLoad={() => {
            console.log('[ZKEngine] WebView Loaded');
            setIsReady(true);
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </ZKContext.Provider>
  );
};
