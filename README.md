# Firebase CORS Proxy

This is a Firebase Cloud Function using `cors-anywhere` to proxy requests with permissive CORS headers.

## Customize
Modify `functions/index.js` to manually white list URLS, or leave it and set it as environmnent variable CORSANYWHERE_WHITELIST.

## Deploy

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Initialize (only needed once):
```bash
firebase login
firebase use --add
cd functions
npm i
cd ..
```
3. Deploy:
```bash
firebase deploy --only functions
```

## Usage

After deployment:
```
https://<project-id>.cloudfunctions.net/corsProxy/<URL>
```
Example
```
https://my-proxy.cloudfunctions.net/corsProxy/https://api.example.com/data
```
