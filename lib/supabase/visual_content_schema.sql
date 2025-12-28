-- Visual Content Generation Schema
-- Feature images, graphics, and brand colors

-- Brand Color Palette (for consistent visuals)
CREATE TABLE IF NOT EXISTS brand_color_palette (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    color_name TEXT NOT NULL, -- 'primary', 'secondary', 'accent', 'background', 'text'
    hex_code TEXT NOT NULL,
    usage_context TEXT[], -- ['feature_images', 'graphics', 'social_posts', 'infographics']
    is_active BOOLEAN DEFAULT TRUE,
    color_order INTEGER DEFAULT 0, -- Display order
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_brand_colors_active ON brand_color_palette(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_brand_colors_context ON brand_color_palette USING GIN(usage_context);

-- Generated Images
CREATE TABLE IF NOT EXISTS generated_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    image_type TEXT NOT NULL CHECK (image_type IN ('feature', 'social', 'thumbnail', 'infographic', 'graphic', 'banner')),
    prompt_used TEXT NOT NULL,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT, -- Smaller version for preview
    provider TEXT, -- 'dalle', 'midjourney', 'stable_diffusion', 'custom', 'uploaded'
    generation_params JSONB, -- Size, style, model, etc.
    brand_colors JSONB, -- Colors used from brand palette
    is_active BOOLEAN DEFAULT TRUE,
    file_size INTEGER, -- Bytes
    dimensions JSONB, -- {width: 1200, height: 630}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_generated_images_article ON generated_images(article_id);
CREATE INDEX idx_generated_images_type ON generated_images(image_type);
CREATE INDEX idx_generated_images_active ON generated_images(article_id, is_active) WHERE is_active = TRUE;

-- Generated Graphics
CREATE TABLE IF NOT EXISTS generated_graphics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    graphic_type TEXT NOT NULL CHECK (graphic_type IN ('infographic', 'chart', 'diagram', 'quote_card', 'cta_banner', 'icon', 'illustration')),
    content_data JSONB NOT NULL, -- Data to visualize
    template_id UUID, -- Reference to graphic template
    image_url TEXT NOT NULL,
    brand_colors_used TEXT[], -- Array of hex codes
    svg_content TEXT, -- If SVG format
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_generated_graphics_article ON generated_graphics(article_id);
CREATE INDEX idx_generated_graphics_type ON generated_graphics(graphic_type);

-- Graphic Templates
CREATE TABLE IF NOT EXISTS graphic_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    graphic_type TEXT NOT NULL CHECK (graphic_type IN ('infographic', 'chart', 'diagram', 'quote_card', 'cta_banner', 'icon')),
    template_structure JSONB NOT NULL, -- SVG/HTML structure or template definition
    default_colors JSONB, -- Default color scheme
    default_dimensions JSONB, -- {width: 800, height: 1200}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_graphic_templates_type ON graphic_templates(graphic_type);
CREATE INDEX idx_graphic_templates_active ON graphic_templates(is_active) WHERE is_active = TRUE;

