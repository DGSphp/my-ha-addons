
import React from 'react';
import { DocsIcon } from './Icons.tsx';

const CodeBlock: React.FC<{ language: string; children: string }> = ({ language, children }) => (
  <pre className="bg-slate-900 rounded-md p-4 my-4 overflow-x-auto">
    <code className={`language-${language} text-sm text-slate-300`}>
      {children.trim()}
    </code>
  </pre>
);

const Documentation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-slate-800/50 p-6 sm:p-8 rounded-lg shadow-lg prose prose-invert prose-slate 
                    prose-h1:text-4xl prose-h1:font-bold prose-h1:text-white prose-h2:text-2xl prose-h2:font-semibold prose-h2:text-slate-100 prose-h2:border-b prose-h2:border-slate-600 prose-h2:pb-2
                    prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-slate-200">
      <h1 className="flex items-center gap-3"><DocsIcon className="w-10 h-10" />Add-on Installation Guide</h1>
      
      <p>This web application is designed to be run as a Home Assistant add-on. Follow these instructions to create your own add-on using your personal GitHub repository.</p>

      <h2>1. Prerequisites</h2>
      <ul>
        <li>A GitHub account and a new repository (e.g., <code>my-ha-addons</code>).</li>
        <li>Home Assistant OS or Supervised installation.</li>
        <li>Familiarity with basic Git commands.</li>
      </ul>

      <h2>2. Repository Structure</h2>
      <p>In your GitHub repository, create the following folder structure. The <code>bluetooth_manager</code> folder will contain the add-on's configuration and the web app files.</p>
      <CodeBlock language="bash">{`
my-ha-addons/
└── bluetooth_manager/
    ├── rootfs/
    │   └── var/
    │       └── www/
    │           ├── index.html
    │           ├── index.tsx
    │           ├── App.tsx
    │           ├── types.ts
    │           ├── components/
    │           │   └── ... (all component files)
    │           └── hooks/
    │               └── useBluetooth.ts
    ├── build.json
    ├── config.yaml
    ├── Dockerfile
    └── run.sh
      `}</CodeBlock>
      <p><strong>Note:</strong> The React files provided in this project (<code>index.html</code>, <code>index.tsx</code>, etc.) should be placed inside the <code>rootfs/var/www/</code> directory.</p>

      <h2>3. Add-on Configuration Files</h2>
      <p>Create the following files inside the <code>bluetooth_manager</code> directory.</p>

      <h3>config.yaml</h3>
      <p>This file defines your add-on's properties for Home Assistant.</p>
      <CodeBlock language="yaml">{`
name: "Bluetooth Manager"
version: "1.0.0"
slug: "bluetooth_manager"
description: "Scan and manage Bluetooth devices from your browser"
url: "https://github.com/YOUR_USERNAME/my-ha-addons/tree/main/bluetooth_manager"
arch:
  - aarch64
  - amd64
  - armhf
  - armv7
  - i386
init: false
panel_icon: "mdi:bluetooth"
panel_title: "Bluetooth Manager"
ingress: true
ingress_port: 80
webui: "http://[HOST]:[PORT:80]"
# Optional: Auto-update and watchdog features
auto_update: true
watchdog: "http://[HOST]:[PORT:80]/"
      `}</CodeBlock>

      <h3>Dockerfile</h3>
      <p>This builds the container image for the add-on, using Nginx to serve the web files.</p>
      <CodeBlock language="dockerfile">{`
# Use a lightweight Nginx image
FROM nginx:1.25.3-alpine

# Copy the web application files into the Nginx web root
COPY rootfs/var/www/ /var/www/

# Expose port 80
EXPOSE 80

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
      `}</CodeBlock>
      <p><strong>Important:</strong> Since this project uses React with JSX/TSX and no build step, a real-world scenario would involve building the project into static JS files first. For this self-contained example, we are assuming a runtime that can handle TSX directly or that you would add a build step (e.g., using Vite or esbuild) to your Dockerfile.</p>

      <h3>run.sh</h3>
      <p>A simple script to start the web server. For an Nginx container, this is often not needed as the `CMD` in the Dockerfile handles it. However, it's good practice to have it.</p>
      <CodeBlock language="bash">{`
#!/usr/bin/with-contenv bashio

bashio::log.info "Starting Nginx server for Bluetooth Manager..."
exec nginx -g "daemon off;"
      `}</CodeBlock>

      <h3>build.json</h3>
      <p>Defines build arguments for different architectures.</p>
      <CodeBlock language="json">{`
{
  "build_from": {
    "aarch64": "nginx:1.25.3-alpine",
    "amd64": "nginx:1.25.3-alpine",
    "armhf": "nginx:1.25.3-alpine",
    "armv7": "nginx:1.25.3-alpine",
    "i386": "nginx:1.25.3-alpine"
  },
  "args": {}
}
      `}</CodeBlock>

      <h2>4. Add Repository to Home Assistant</h2>
      <ol>
        <li>In Home Assistant, go to <strong>Settings &gt; Add-ons &gt; Add-on Store</strong>.</li>
        <li>Click the three-dots menu in the top right and select <strong>Repositories</strong>.</li>
        <li>Paste the URL of your GitHub repository (e.g., <code>https://github.com/YOUR_USERNAME/my-ha-addons</code>) and click <strong>Add</strong>.</li>
        <li>Close the dialog. Your repository will now be listed as a source for add-ons.</li>
      </ol>

      <h2>5. Install the Add-on</h2>
      <ol>
        <li>Refresh the Add-on Store page. A new section, "My HA Add-ons" (or your repo name), should appear.</li>
        <li>Find "Bluetooth Manager" in this new section and click on it.</li>
        <li>Click <strong>Install</strong> and wait for the process to complete.</li>
        <li>Once installed, enable <strong>"Show in sidebar"</strong> to add it to your main Home Assistant menu.</li>
        <li>Click <strong>Start</strong> to run the add-on.</li>
        <li>Click <strong>Open Web UI</strong> or the sidebar link to access the Bluetooth Manager.</li>
      </ol>
    </div>
  );
};

export default Documentation;
