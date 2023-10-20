{% comment %}
  Renders a product media gallery. Should be used with 'media-gallery.js'
  Also see 'product-media-modal'

  Accepts:
  - product: {Object} Product liquid object
  - variant_images: {Array} Product images associated with a variant
  - is_duplicate: {Boolean} Prevents rendering uneeded elements and duplicate ids for subsequent instances

  Usage:
  {% render 'product-media-gallery', is_duplicate: true %}
{% endcomment %}

{%- liquid
  if section.settings.hide_variants and variant_images.size == product.media.size
    assign single_media_visible = true
  endif

  assign media_count = product.media.size
  if section.settings.hide_variants and media_count > 1 and variant_images.size > 0
    assign media_count = media_count | minus: variant_images.size | plus: 1
  endif

  if media_count == 1 or single_media_visible
    assign single_media_visible_mobile = true
  endif

  if media_count == 0 or single_media_visible_mobile or section.settings.mobile_thumbnails == 'show' or section.settings.mobile_thumbnails == 'columns' and media_count < 3
    assign hide_mobile_slider = true
  endif

  if section.settings.media_size == 'large'
    assign media_width = 0.65
  elsif section.settings.media_size == 'medium'
    assign media_width = 0.55
  elsif section.settings.media_size == 'small'
    assign media_width = 0.45
  endif

  assign id_append = ''
  if is_duplicate
    assign id_append = '-duplicate'
  endif
-%}

<media-gallery
  id="MediaGallery-{{ section.id }}{{ id_append }}"
  role="region"
  {% if section.settings.enable_sticky_info %}
    class="product__column-sticky"
  {% endif %}
  aria-label="{{ 'products.product.media.gallery_viewer' | t }}"
  data-desktop-layout="{{ section.settings.gallery_layout }}"
>
  <div id="GalleryStatus-{{ section.id }}" class="visually-hidden" role="status"></div>
  <slider-component id="GalleryViewer-{{ section.id }}{{ id_append }}" class="slider-mobile-gutter">
    {%- unless is_duplicate -%}
      <a class="skip-to-content-link button visually-hidden quick-add-hidden" href="#ProductInfo-{{ section.id }}">
        {{ 'accessibility.skip_to_product_info' | t }}
      </a>
    {%- endunless -%}
    <ul
      id="Slider-Gallery-{{ section.id }}{{ id_append }}"
      class="product__media-list contains-media grid grid--peek list-unstyled slider slider--everywhere"
      role="list"
    >
      {%- if product.selected_or_first_available_variant.featured_media != null -%}
        {%- assign featured_media = product.selected_or_first_available_variant.featured_media -%}
        <li
          id="Slide-{{ section.id }}-{{ featured_media.id }}{{ id_append }}"
          class="product__media-item grid__item slider__slide is-active{% if single_media_visible %} product__media-item--single{% endif %}{% if featured_media.media_type != 'image' %} product__media-item--full{% endif %}{% if section.settings.hide_variants and variant_images contains featured_media.src %} product__media-item--variant{% endif %}{% if settings.animations_reveal_on_scroll %} scroll-trigger animate--fade-in{% endif %}"
          data-media-id="{{ section.id }}-{{ featured_media.id }}"
        >
          {%- assign media_position = 1 -%}
          {% render 'product-thumbnail',
            media: featured_media,
            media_count: media_count,
            position: media_position,
            desktop_layout: section.settings.gallery_layout,
            mobile_layout: section.settings.mobile_thumbnails,
            loop: section.settings.enable_video_looping,
            modal_id: section.id,
            xr_button: true,
            media_width: media_width,
            media_fit: section.settings.media_fit,
            constrain_to_viewport: section.settings.constrain_to_viewport,
            lazy_load: false
          %}
        </li>
      {%- endif -%}
      {% assign in = 1 %}
      {%- for media in product.media -%}
        {% if in < 3 %}
        {%- unless media.id == product.selected_or_first_available_variant.featured_media.id -%}
          <li
            id="Slide-{{ section.id }}-{{ media.id }}{{ id_append }}"
            class="product__media-item grid__item slider__slide{% if single_media_visible %} product__media-item--single{% endif %}{% if product.selected_or_first_available_variant.featured_media == null and forloop.index == 1 %} is-active{% endif %}{% if media.media_type != 'image' %} product__media-item--full{% endif %}{% if section.settings.hide_variants and variant_images contains media.src %} product__media-item--variant{% endif %}{% if settings.animations_reveal_on_scroll %} scroll-trigger animate--fade-in{% endif %}"
            data-media-id="{{ section.id }}-{{ media.id }}"
          >
            {%- liquid
              assign media_position = media_position | default: 0 | plus: 1
              assign lazy_load = false
              if media_position > 1
                assign lazy_load = true
              endif
            -%}
            {% render 'product-thumbnail',
              media: media,
              media_count: media_count,
              position: media_position,
              desktop_layout: section.settings.gallery_layout,
              mobile_layout: section.settings.mobile_thumbnails,
              loop: section.settings.enable_video_looping,
              modal_id: section.id,
              xr_button: true,
              media_width: media_width,
              media_fit: section.settings.media_fit,
              constrain_to_viewport: section.settings.constrain_to_viewport,
              lazy_load: lazy_load
            %}
          </li>
        {%- endunless -%}
          {% endif %}
        {% assign in = in | plus: 1 %}
      {%- endfor -%}
    </ul>
    {%- unless is_duplicate -%}
      <div class="slider-buttons pdp no-js-hidden quick-add-hidden{% if hide_mobile_slider %} small-hide{% endif %}">
        <button
          type="button"
          class="slider-button slider-button--prev"
          name="previous"
          aria-label="{{ 'general.slider.previous_slide' | t }}"
        >
          {% render 'icon-caret' %}
        </button>
        <div class="slider-counter caption">
          <span class="slider-counter--current">1</span>
          <span aria-hidden="true"> / </span>
          <span class="visually-hidden">{{ 'general.slider.of' | t }}</span>
          <span class="slider-counter--total">{{ media_count }}</span>
        </div>
        <button
          type="button"
          class="slider-button slider-button--next"
          name="next"
          aria-label="{{ 'general.slider.next_slide' | t }}"
        >
          {% render 'icon-caret' %}
        </button>
      </div>
    {%- endunless -%}
  </slider-component>
  {%- if first_3d_model -%}
    <button
      class="button button--full-width product__xr-button"
      type="button"
      aria-label="{{ 'products.product.xr_button_label' | t }}"
      data-shopify-xr
      data-shopify-model3d-id="{{ first_3d_model.id }}"
      data-shopify-title="{{ product.title | escape }}"
      data-shopify-xr-hidden
    >
      {% render 'icon-3d-model' %}
      {{ 'products.product.xr_button' | t }}
    </button>
  {%- endif -%}
  {%- if media_count > 1
    and section.settings.gallery_layout contains 'thumbnail'
    or section.settings.mobile_thumbnails == 'show'
  -%}
    <slider-component
      id="GalleryThumbnails-{{ section.id }}{{ id_append }}" style="display:none;"
      class="thumbnail-slider slider-mobile-gutter quick-add-hidden{% unless section.settings.gallery_layout contains 'thumbnail' %} medium-hide large-up-hide{% endunless %}{% if section.settings.mobile_thumbnails != 'show' %} small-hide{% endif %}{% if media_count <= 3 %} thumbnail-slider--no-slide{% endif %}"
    >
      <button
        type="button"
        class="slider-button slider-button--prev{% if media_count <= 3 %} small-hide{% endif %}{% if media_count <= 4 %} medium-hide large-up-hide{% endif %}"
        name="previous"
        aria-label="{{ 'general.slider.previous_slide' | t }}"
        aria-controls="GalleryThumbnails-{{ section.id }}"
        data-step="3"
      >
        {% render 'icon-caret' %}
      </button>
      <ul
        id="Slider-Thumbnails-{{ section.id }}{{ id_append }}"
        class="thumbnail-list list-unstyled slider slider--mobile{% if section.settings.gallery_layout == 'thumbnail_slider' %} slider--tablet-up{% endif %}"
      >
        {%- capture sizes -%}
          (min-width: {{ settings.page_width }}px) calc(({{ settings.page_width | minus: 100 | times: media_width | round }} - 4rem) / 4),
          (min-width: 990px) calc(({{ media_width | times: 100 }}vw - 4rem) / 4),
          (min-width: 750px) calc((100vw - 15rem) / 8),
          calc((100vw - 8rem) / 3)
        {%- endcapture -%}

        {%- if featured_media != null -%}
          {%- liquid
            capture media_index
              if featured_media.media_type == 'model'
                increment model_index
              elsif featured_media.media_type == 'video' or featured_media.media_type == 'external_video'
                increment video_index
              elsif featured_media.media_type == 'image'
                increment image_index
              endif
            endcapture
            assign media_index = media_index | plus: 1
          -%}
          <li
            id="Slide-Thumbnails-{{ section.id }}-0{{ id_append }}"
            class="thumbnail-list__item slider__slide{% if section.settings.hide_variants and variant_images contains featured_media.src %} thumbnail-list_item--variant{% endif %}"
            data-target="{{ section.id }}-{{ featured_media.id }}"
            data-media-position="{{ media_index }}"
          >
            {%- capture thumbnail_id -%}
              Thumbnail-{{ section.id }}-0{{ id_append }}
            {%- endcapture -%}
            <button
              class="thumbnail global-media-settings global-media-settings--no-shadow"
              aria-label="{%- if featured_media.media_type == 'image' -%}{{ 'products.product.media.load_image' | t: index: media_index }}{%- elsif featured_media.media_type == 'model' -%}{{ 'products.product.media.load_model' | t: index: media_index }}{%- elsif featured_media.media_type == 'video' or featured_media.media_type == 'external_video' -%}{{ 'products.product.media.load_video' | t: index: media_index }}{%- endif -%}"
              aria-current="true"
              aria-controls="GalleryViewer-{{ section.id }}{{ id_append }}"
              aria-describedby="{{ thumbnail_id }}"
            >
              {{
                featured_media.preview_image
                | image_url: width: 416
                | image_tag:
                  loading: 'lazy',
                  sizes: sizes,
                  widths: '54, 74, 104, 162, 208, 324, 416',
                  id: thumbnail_id,
                  alt: featured_media.alt
                | escape
              }}
            </button>
          </li>
        {%- endif -%}
        {%- for media in product.media -%}
          {%- unless media.id == product.selected_or_first_available_variant.featured_media.id -%}
            {%- liquid
              capture media_index
                if media.media_type == 'model'
                  increment model_index
                elsif media.media_type == 'video' or media.media_type == 'external_video'
                  increment video_index
                elsif media.media_type == 'image'
                  increment image_index
                endif
              endcapture
              assign media_index = media_index | plus: 1
            -%}
            <li
              id="Slide-Thumbnails-{{ section.id }}-{{ forloop.index }}{{ id_append }}"
              class="thumbnail-list__item slider__slide{% if section.settings.hide_variants and variant_images contains media.src %} thumbnail-list_item--variant{% endif %}"
              data-target="{{ section.id }}-{{ media.id }}"
              data-media-position="{{ media_index }}"
            >
              {%- if media.media_type == 'model' -%}
                <span class="thumbnail__badge" aria-hidden="true">
                  {%- render 'icon-3d-model' -%}
                </span>
              {%- elsif media.media_type == 'video' or media.media_type == 'external_video' -%}
                <span class="thumbnail__badge" aria-hidden="true">
                  {%- render 'icon-play' -%}
                </span>
              {%- endif -%}
              {%- capture thumbnail_id -%}
                Thumbnail-{{ section.id }}-{{ forloop.index }}{{ id_append }}
              {%- endcapture -%}
              <button
                class="thumbnail global-media-settings global-media-settings--no-shadow"
                aria-label="{%- if media.media_type == 'image' -%}{{ 'products.product.media.load_image' | t: index: media_index }}{%- elsif media.media_type == 'model' -%}{{ 'products.product.media.load_model' | t: index: media_index }}{%- elsif media.media_type == 'video' or media.media_type == 'external_video' -%}{{ 'products.product.media.load_video' | t: index: media_index }}{%- endif -%}"
                {% if media == product.selected_or_first_available_variant.featured_media
                  or product.selected_or_first_available_variant.featured_media == null
                  and forloop.index == 1
                %}
                  aria-current="true"
                {% endif %}
                aria-controls="GalleryViewer-{{ section.id }}{{ id_append }}"
                aria-describedby="{{ thumbnail_id }}"
              >
                {{
                  media.preview_image
                  | image_url: width: 416
                  | image_tag:
                    loading: 'lazy',
                    sizes: sizes,
                    widths: '54, 74, 104, 162, 208, 324, 416',
                    id: thumbnail_id,
                    alt: media.alt
                  | escape
                }}
              </button>
            </li>
          {%- endunless -%}
        {%- endfor -%}
      </ul>
      <button
        type="button"
        class="slider-button slider-button--next{% if media_count <= 3 %} small-hide{% endif %}{% if media_count <= 4 %} medium-hide large-up-hide{% endif %}"
        name="next"
        aria-label="{{ 'general.slider.next_slide' | t }}"
        aria-controls="GalleryThumbnails-{{ section.id }}"
        data-step="3"
      >
        {% render 'icon-caret' %}
      </button>
    </slider-component>
  {%- endif -%}
</media-gallery>
