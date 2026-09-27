import localtunnel from 'localtunnel';
import { tunnelmole } from 'tunnelmole';
import fs from 'fs';

(async () => {
  let url = null;
  
  // Clean up any old output file
  if (fs.existsSync("tunnel_url.txt")) {
    try { fs.unlinkSync("tunnel_url.txt"); } catch (e) {}
  }
  
  console.log("Attempting localtunnel on port 5173 with explicit IPv4 mapping...");
  const ltPromise = localtunnel({ port: 5173, local_host: '127.0.0.1' }).then(t => t.url);
  const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("localtunnel Timeout")), 15000));
  
  try {
    url = await Promise.race([ltPromise, timeoutPromise]);
    console.log("localtunnel succeeded! URL:", url);
  } catch (e) {
    console.log("localtunnel failed or timed out. Falling back to tunnelmole...");
    try {
      url = await tunnelmole({ port: 5173 });
      console.log("tunnelmole succeeded! URL:", url);
    } catch (err) {
      console.error("Both tunnel services failed:", err);
      url = "ERROR: Failed to establish public tunnel.";
    }
  }
  
  fs.writeFileSync("tunnel_url.txt", url + "\n");
  console.log("Done! URL written to tunnel_url.txt: ", url);
})();
