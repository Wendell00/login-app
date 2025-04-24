describe('generateSecretHash', () => {
    const username = 'testuser';
    const clientId = 'client123';
    const clientSecret = 'supersecret';
  
    beforeEach(async () => {
      jest.resetModules();
  
      global.TextEncoder = class {
        encode(str: string) {
          return new Uint8Array(Buffer.from(str));
        }
      } as unknown as typeof TextEncoder;
  
      const subtleMock = {
        importKey: jest.fn().mockResolvedValue('mocked-key'),
        sign: jest.fn().mockResolvedValue(Uint8Array.from([72, 101, 108, 108, 111])) 
      };
  
      Object.defineProperty(globalThis, 'crypto', {
        value: { subtle: subtleMock },
        configurable: true,
      });
    });
  
    it('should generate a base64 HMAC secret hash using Web Crypto API', async () => {
      const { generateSecretHash } = await import('./helpers');
  
      const hash = await generateSecretHash(username, clientId, clientSecret);
  
      expect(hash).toBe('SGVsbG8='); 
      expect(globalThis.crypto.subtle.importKey).toHaveBeenCalled();
      expect(globalThis.crypto.subtle.sign).toHaveBeenCalled();
    });
  });
  