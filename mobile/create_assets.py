from PIL import Image
import os

os.chdir('assets')

# Remove old .txt files
for f in ['icon.png.txt', 'splash.png.txt', 'adaptive-icon.png.txt', 'favicon.png.txt']:
    try:
        os.remove(f)
        print(f'Removed {f}')
    except:
        pass

# Create icon (1024x1024)
img = Image.new('RGB', (1024, 1024), color=(102, 126, 234))  # #667eea
img.save('icon.png')
print('Created icon.png')

# Create adaptive icon (108x108)
img = Image.new('RGB', (108, 108), color=(102, 126, 234))
img.save('adaptive-icon.png')
print('Created adaptive-icon.png')

# Create splash (1200x1600)
img = Image.new('RGB', (1200, 1600), color=(102, 126, 234))
img.save('splash.png')
print('Created splash.png')

# Create favicon (192x192)
img = Image.new('RGB', (192, 192), color=(102, 126, 234))
img.save('favicon.png')
print('Created favicon.png')

print('\nAll assets created successfully!')
