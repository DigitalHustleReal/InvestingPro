# Block Editor Guide (Gutenberg-style)

## Overview
We've upgraded from TipTap to **BlockNote** - a modern, Gutenberg-style block-based editor that provides a much better editing experience.

## Features

### 🎯 Block-Based Editing
- **Drag & Drop**: Move blocks around by dragging
- **Slash Commands**: Type `/` to see available blocks
- **Block Menu**: Click the `+` button or `/` to add new blocks

### 📝 Available Blocks

1. **Text Blocks**
   - Paragraph
   - Heading (H1-H6)
   - Quote
   - Code block

2. **List Blocks**
   - Bullet list
   - Numbered list
   - Task list (checkboxes)

3. **Media Blocks**
   - Image
   - Video (can be extended)

4. **Layout Blocks**
   - Table
   - Columns (can be extended)

5. **Special Blocks**
   - Horizontal rule
   - Callout/Alert (can be extended)

## How to Use

### Creating New Content
1. Start typing - creates a paragraph block
2. Type `/` to see all available blocks
3. Select a block type from the menu

### Editing Blocks
- Click on any block to edit
- Use the toolbar that appears above the block
- Drag the handle (⋮⋮) on the left to reorder blocks

### Formatting Text
- **Bold**: `Ctrl+B` or select text and click Bold
- **Italic**: `Ctrl+I` or select text and click Italic
- **Link**: Select text and click Link icon
- **Code**: Select text and click Code icon

### Adding Images
1. Type `/image` or click the `+` button
2. Select "Image" from the menu
3. Paste image URL or upload (if upload is configured)

### Adding Tables
1. Type `/table` or click the `+` button
2. Select "Table" from the menu
3. Choose number of rows and columns

## Keyboard Shortcuts

- `/` - Open block menu
- `Enter` - Create new block
- `Backspace` at start - Delete block
- `Ctrl+B` - Bold
- `Ctrl+I` - Italic
- `Ctrl+K` - Add link
- `Ctrl+Z` - Undo
- `Ctrl+Shift+Z` - Redo
- `Arrow Up/Down` - Navigate between blocks
- `Tab` - Indent (for lists)
- `Shift+Tab` - Outdent (for lists)

## Advantages Over TipTap

1. **Better UX**: Block-based editing is more intuitive
2. **Drag & Drop**: Easily reorder content
3. **Slash Commands**: Fast block insertion
4. **Better Mobile**: Touch-friendly block manipulation
5. **Extensible**: Easy to add custom blocks
6. **Modern**: Built with latest React patterns
7. **No SSR Issues**: Properly handles server-side rendering

## Migration Notes

- Existing HTML content is automatically converted to blocks
- All formatting is preserved
- Images and links work the same way
- Tables are converted to block format

## Future Enhancements

Possible custom blocks to add:
- **Product Comparison Table**: For comparing financial products
- **Calculator Embed**: Embed financial calculators
- **Chart Block**: Display data visualizations
- **FAQ Block**: Structured FAQ format
- **Call-to-Action Block**: Prominent CTA buttons
- **Testimonial Block**: Customer testimonials
- **Stats Block**: Key statistics display

## Technical Details

- **Library**: BlockNote (`@blocknote/react`)
- **Storage**: Content saved as HTML (compatible with existing database)
- **Conversion**: Automatic HTML ↔ Blocks conversion
- **Performance**: Optimized for large documents

## Troubleshooting

### Editor not loading
- Check browser console for errors
- Ensure BlockNote packages are installed: `npm install @blocknote/core @blocknote/react`
- Clear browser cache and refresh

### Content not saving
- Check network tab for API errors
- Verify content is being converted to HTML correctly
- Check browser console for errors

### Blocks not appearing
- Type `/` to see available blocks
- Check if you're in the correct block type
- Try clicking the `+` button


