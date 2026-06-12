import { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

const codeExamples = [
  {
    title: 'Model Definition (PyTorch)',
    language: 'python',
    code: `import torch
import torch.nn as nn

class ImageEnhancementCNN(nn.Module):
    def __init__(self, num_residual_blocks=8):
        super().__init__()
        
        # Initial feature extraction
        self.input_conv = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=3, padding=1),
            nn.ReLU(inplace=True)
        )
        
        # Residual blocks for deep feature learning
        self.residual_blocks = nn.Sequential(
            *[ResidualBlock(64) for _ in range(num_residual_blocks)]
        )
        
        # Upsampling with PixelShuffle
        self.upsample = nn.Sequential(
            nn.Conv2d(64, 256, kernel_size=3, padding=1),
            nn.PixelShuffle(2),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 256, kernel_size=3, padding=1),
            nn.PixelShuffle(2),
            nn.ReLU(inplace=True)
        )
        
        # Output reconstruction
        self.output_conv = nn.Conv2d(64, 3, kernel_size=3, padding=1)
    
    def forward(self, x):
        feat = self.input_conv(x)
        res = self.residual_blocks(feat)
        out = self.upsample(feat + res)  # Skip connection
        return self.output_conv(out)`,
  },
  {
    title: 'Training Loop',
    language: 'python',
    code: `import torch.optim as optim
from torch.utils.data import DataLoader

# Initialize model, loss, optimizer
model = ImageEnhancementCNN().cuda()
criterion = nn.MSELoss()
perceptual_loss = PerceptualLoss().cuda()
optimizer = optim.Adam(model.parameters(), lr=1e-4)

# Training loop
for epoch in range(60):
    model.train()
    epoch_loss = 0
    
    for batch_idx, (noisy, clean) in enumerate(train_loader):
        noisy, clean = noisy.cuda(), clean.cuda()
        
        # Forward pass
        enhanced = model(noisy)
        
        # Combined loss
        mse = criterion(enhanced, clean)
        percep = perceptual_loss(enhanced, clean)
        loss = mse + 0.1 * percep
        
        # Backward pass
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        epoch_loss += loss.item()
    
    # Evaluate PSNR
    psnr = evaluate_psnr(model, val_loader)
    print(f"Epoch {epoch+1}/60 | Loss: {epoch_loss:.4f} | PSNR: {psnr:.2f} dB")`,
  },
  {
    title: 'Image Preprocessing (OpenCV)',
    language: 'python',
    code: `import cv2
import numpy as np
from torchvision import transforms

def preprocess_image(image_path):
    """Load and preprocess image for model input."""
    # Read image with OpenCV
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Resize to model input size
    img = cv2.resize(img, (256, 256), 
                     interpolation=cv2.INTER_CUBIC)
    
    # Apply degradation augmentation for training
    noisy = add_gaussian_noise(img, sigma=25)
    noisy = apply_jpeg_compression(noisy, quality=30)
    
    # Convert to tensor
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                           std=[0.229, 0.224, 0.225])
    ])
    
    return transform(noisy), transform(img)

def add_gaussian_noise(image, sigma=25):
    """Add Gaussian noise to simulate real-world degradation."""
    noise = np.random.normal(0, sigma, image.shape).astype(np.float32)
    noisy = np.clip(image.astype(np.float32) + noise, 0, 255)
    return noisy.astype(np.uint8)`,
  },
];

export default function CodeSnippet() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="code" className="py-24 bg-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-pink-400 tracking-widest uppercase">
            Implementation
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-5">
            Code Highlights
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Key code snippets showcasing the CNN model definition, training pipeline,
            and image preprocessing with OpenCV.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Tab bar */}
          <div className="flex flex-wrap gap-2 mb-4">
            {codeExamples.map((example, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === i
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Code2 className="w-4 h-4" />
                {example.title}
              </button>
            ))}
          </div>

          {/* Code block */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-slate-500 text-xs ml-2">{codeExamples[activeTab].title}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-slate-500 hover:text-white text-xs transition-colors bg-slate-800 px-3 py-1.5 rounded-lg"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Code */}
            <pre className="p-6 overflow-x-auto text-sm leading-relaxed">
              <code className="text-slate-300 font-mono whitespace-pre">
                {codeExamples[activeTab].code}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
