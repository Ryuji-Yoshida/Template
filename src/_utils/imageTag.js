const escapeAttribute = (value) => String(value).replace(/"/g, '&quot;');

const resolveImagePath = (imgPath, assetBasePath) => {
  return imgPath.startsWith('http') ? imgPath : `${assetBasePath}assets/images/${imgPath}`;
};

const buildAttributes = (attrs, allowEmpty = []) => {
  return Object.entries(attrs)
    .filter(([key, value]) =>
      value !== undefined && value !== null && (value !== '' || allowEmpty.includes(key)),
    )
    .map(([key, value]) => ` ${key}="${escapeAttribute(value)}"`)
    .join('');
};

const createImageTagHelpers = (assetBasePath = '/') => ({
  srcTag(imgPath, width, height, className = '', media = '') {
    const src = resolveImagePath(imgPath, assetBasePath);
    const classAttribute = className ? ` class="${escapeAttribute(className)}"` : '';

    return `<source${classAttribute} srcset="${src}" media="${escapeAttribute(media)}" width="${width}" height="${height}">`;
  },

  srcRetinaTag(imgPath1x, imgPath2x, width, height, className = '', media = '') {
    const src1x = `${resolveImagePath(imgPath1x, assetBasePath)} 1x`;
    const src2x = `${resolveImagePath(imgPath2x, assetBasePath)} 2x`;
    const classAttribute = className ? ` class="${escapeAttribute(className)}"` : '';

    return `<source${classAttribute} srcset="${src1x}, ${src2x}" media="${escapeAttribute(media)}" width="${width}" height="${height}">`;
  },

  imgTag(imgPath, width, height, options = '') {
    const normalizedOptions = typeof options === 'object' ? options : { alt: options };
    const {
      alt = '',
      className = '',
      loading = true,
      attrs = {},
    } = normalizedOptions;
    const src = resolveImagePath(imgPath, assetBasePath);

    return `<img${buildAttributes({
      src,
      alt,
      width,
      height,
      ...(className ? { class: className } : {}),
      ...(loading ? { loading: 'lazy' } : {}),
      ...attrs,
    }, ['alt'])}>`;
  },
});

export default createImageTagHelpers;
