# AegisCipher-Pro

AegisCipher Pro is an enterprise-grade, highly polished commercial-grade cybersecurity console tailored for digital compliance, security audits, and offline-first text payload protection. It features a modern, ultra-responsive web application that is fully standalone and optimized for running on localhost inside Visual Studio Code.

---

## 📂 Project Structure

```text
AegisCipher-Pro/
│
├── src/
│   ├── components/
│   │   ├── AboutView.tsx          # Specifications & system overview panel
│   │   ├── AesView.tsx            # Symmetric AES-256 block cipher module
│   │   ├── DashboardView.tsx      # Central SOC stats metrics dashboard
│   │   ├── DesView.tsx            # Legacy DES symmetric block cipher module
│   │   ├── HashView.tsx           # Cryptographic hash digest checksum utility
│   │   ├── RightPanel.tsx         # Parameters sidebar and live SOC activity logger
│   │   ├── RsaView.tsx            # Asymmetric RSA-2048 dual-keypair cipher
│   │   ├── SettingsView.tsx       # Local storage maintenance & settings panel
│   │   ├── Sidebar.tsx            # Collapsible cybersecurity sidebar navigation
│   │   ├── StatusBar.tsx          # Real-time console state footer indicator
│   │   └── WelcomeView.tsx        # High-performance animated SOC welcome screen
│   │
│   ├── App.tsx                    # Main app component integrated with React Router
│   ├── main.tsx                   # Standalone entry point wrapping the App in HashRouter
│   ├── types.ts                   # Unified TypeScript definitions for logs & stats
│   └── index.css                  # Global styling using Tailwind CSS
│
├── public/                        # Static assets & public vectors
│
├── package.json                   # Standalone npm package & dependency manifest
├── vite.config.ts                 # Modern Vite configuration for React & Tailwind
├── tsconfig.json                  # TypeScript compiler options
├── README.md                      # Comprehensive developer and system documentation
├── .gitignore                     # Git tracking exemptions
└── .env.example                   # Local environment variable template
```

---

## 🛠️ Prerequisites

To run this project locally, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher is recommended)
- **npm** (v9.0.0 or higher, comes bundled with Node.js)
- **Visual Studio Code** (or your preferred local code editor)

---

## 🚀 Installation & Setup

Follow these simple steps to download and run AegisCipher Pro locally on your machine:

1. **Clone or Download the Repository**:
   Extract the project files to a local folder (e.g., `AegisCipher-Pro`).

2. **Open the Project in VS Code**:
   Launch Visual Studio Code, select **File > Open Folder**, and open your project folder.

3. **Install Dependencies**:
   Open a terminal in VS Code (`Ctrl+`` or **Terminal > New Terminal**) and run:
   ```bash
   npm install
   ```

4. **Launch the Development Server**:
   Start the interactive development console on your localhost:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Once the server starts, open your web browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## ⚡ Commands Reference

### Run the Development Server
```bash
npm run dev
```
Launches the hot-rebuilding server on port `3000`.

### Build for Production
```bash
npm run build
```
Compiles and bundles the application into high-performance static files inside the `dist/` folder, ready to be hosted on any static file server (Netlify, Vercel, AWS S3, etc.).

### Local Preview
```bash
npm run preview
```
Runs a local server to preview the production-compiled build.

### Linting
```bash
npm run lint
```
Runs the TypeScript typechecker to verify project integrity.

---

## 📦 Major System Dependencies

The application relies on trusted, standard modern web packages for offline-first processing:
- **react** & **react-dom** (v19+): Powers the interactive, declarative user interface.
- **react-router-dom** (v6+): Drives standard URL-driven route navigation (using safe `HashRouter` for robust path resolution on static local targets).
- **motion** (v12+): Drives ultra-smooth, lightweight CSS/hardware-accelerated page entry and interactive micro-animations.
- **lucide-react** (v0.546+): Provides a cohesive, enterprise-grade vector iconography suite.
- **crypto-js** (v4.2.0): Executes ultra-secure, standard-compliant, zero-latency client-side cryptography.
- **tailwindcss** (v4+): Provides utility-first styling for high-contrast cyber-blue console layout.

---

## 🛡️ Standalone Cryptographic Execution Details

AegisCipher Pro processes all encryption, decryption, and hash operations **entirely client-side** in your browser. No sensitive text payloads or keys are ever uploaded to external servers, providing an air-gapped cryptographic playground:
- **AES-256-CBC**: Utilizes PKCS7 block border padding for military-grade symmetric cipher execution.
- **DES-CBC**: Maintains backwards compliance for legacy data payloads.
- **RSA-2048**: Generates asymmetric public/private key pairs and executes RSA ciphers using standard RSA-OAEP padding.
- **Cryptographic Hashing**: Instantly generates MD5, SHA-1, SHA-256, and SHA-512 cryptographic checksums with visual audit trails.
- **SOC Security Logger**: Maintains a dynamic, searchable audit log preserved securely across browser sessions via standard `localStorage`.+

---

# 🤝 Contribution

Contributions, issues, and feature requests are welcome.

If you'd like to contribute to this project:

1. Fork this repository.
2. Create a new feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to your branch (`git push origin feature-name`).
5. Open a Pull Request.

---

# 👨‍💻 Author & Developer

### **Dhrumin Patel**

**Cyber Security & Forensic Science Student**

🔗 **GitHub:**  
https://github.com/Dhrumin1327

💼 **LinkedIn:**  
https://www.linkedin.com/in/dhrumin-patel-0412792a5/

---

# 📞 Support

If you found this project useful, please consider:

- ⭐ Starring this repository
- 🍴 Forking this repository
- 📢 Sharing it with others

For suggestions, improvements, collaborations, or any queries, feel free to connect with me via **GitHub** or **LinkedIn**.

---

# ⚠️ Disclaimer

This project is developed for **educational, academic, and research purposes only**. It is intended to demonstrate cryptographic concepts and secure text encryption techniques.

The author is **not responsible for any misuse** of this software.

---

# 🙏 Acknowledgements

Special thanks to:

- Python Community
- Flask Community
- Cryptography Documentation
- Open Source Contributors

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute this project for educational or personal purposes, provided that proper credit is given to the original author.

---

<p align="center">
  Made with ❤️ by <strong>Dhrumin Patel</strong><br><br>
  ⭐ If you found this project helpful, don't forget to Star the Repository.
</p>
