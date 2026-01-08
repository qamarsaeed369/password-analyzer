# PassShield - AI-Powered Password Strength Analyzer

A privacy-first password strength estimation tool powered by **client-side TensorFlow.js Neural Networks**.

## 🎓 M.Sc. Dissertation Project

This project implements the system described in the dissertation:  
**"AI-Powered Password Strength Estimation and Cracking Using JavaScript"**

## ✨ Features

- **🧠 AI-Powered Analysis**: Neural Network (128/64 nodes) trained on 15,000 password samples
- **🔒 100% Privacy**: All computation happens in your browser - no data transmission
- **📊 Comprehensive Metrics**: Entropy, brute force estimates, dictionary checks, and AI predictions
- **📈 Real-Time Visualization**: Interactive charts and strength meters
- **🎨 Modern UI**: Beautiful, responsive design with dark mode support

## 🏗️ Architecture

### Client-Side Neural Network

```
Input Layer:  9 features (password characteristics)
    ↓
Hidden Layer 1: 128 nodes (ReLU activation)
    ↓
Hidden Layer 2: 64 nodes (ReLU activation)
    ↓
Output Layer: 1 node (Sigmoid → Score 0-100)
```

### Input Features

1. Password length
2. Has lowercase letters (0/1)
3. Has uppercase letters (0/1)
4. Has digits (0/1)
5. Has special characters (0/1)
6. Shannon entropy
7. Unique character count
8. Unique character ratio
9. Character diversity score

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/qamarsaeed369/password-analyzer.git
cd password-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3001` in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📚 Technology Stack

- **Framework**: Next.js 15
- **ML Library**: TensorFlow.js
- **Language**: TypeScript
- **UI**: React + Tailwind CSS
- **Charts**: Chart.js
- **Icons**: Lucide React

## 🔬 Model Performance

| Metric | Value |
|--------|-------|
| **Accuracy** | 86% |
| **Precision** | 0.82 |
| **Recall** | 0.88 |
| **F1-Score** | 0.85 |
| **Inference Time** | < 50ms |

## 🛡️ Privacy Guarantees

✅ **No Network Requests**: All computation is local  
✅ **No Data Storage**: Passwords never leave browser RAM  
✅ **No Logging**: Zero telemetry or analytics  
✅ **Open Source**: Code is auditable and transparent

## 📖 Documentation

- [`PRESENTATION.md`](./PRESENTATION.md) - Detailed presentation guide for defense
- [`MIGRATION.md`](./MIGRATION.md) - Technical migration details
- [Dissertation PDF](#) - Full academic report

## 🎯 Use Cases

- **Educational Tool**: Learn about password security
- **Password Auditing**: Check existing passwords
- **Security Training**: Demonstrate attack vectors
- **Research**: Study password patterns

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Qamar Saeed**  
M.Sc. Data Science and AI  
University of [Your University]

## 🙏 Acknowledgments

- Supervisor: Mr. Chris Hewes-Lewington
- TensorFlow.js Team
- RockYou Dataset (sanitized)
- NIST SP 800-63B Guidelines

## 📚 References

- Bonneau, J. (2012) - Password entropy analysis
- Melicher et al. (2016) - Neural networks for password guessing
- Hitaj et al. (2019) - PassGAN
- NIST SP 800-63B (2017) - Password guidelines

---

**Note**: This tool is for educational purposes. Always use strong, unique passwords and enable two-factor authentication.
