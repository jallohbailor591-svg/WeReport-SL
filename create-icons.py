import base64
from PIL import Image, ImageDraw

def create_icon(size, filename):
    # Create a new image with green background
    img = Image.new('RGB', (size, size), color='#10b981')
    draw = ImageDraw.Draw(img)
    
    # Draw white circle
    margin = size // 6
    draw.ellipse([margin, margin, size - margin, size - margin], fill='white')
    
    # Draw green inner circle
    inner_margin = size // 3
    draw.ellipse([inner_margin, inner_margin, size - inner_margin, size - inner_margin], fill='#10b981')
    
    # Save as PNG
    img.save(filename, 'PNG')
    print(f"Created {filename}")

# Create both icons
create_icon(192, 'public/icon-192.png')
create_icon(512, 'public/icon-512.png')
