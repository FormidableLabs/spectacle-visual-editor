import { formatKebabToCamelCase } from './format-kebab-to-camel-case';

export const getStyleObjectFromString = (str: string | null) => {
  const style: { [key: string]: string } = {};
  if (!str) return style;
  str.split(';').forEach((el) => {
    const [property, value] = el.split(':');
    if (!property) return;

    const formattedProperty = formatKebabToCamelCase(property.trim());
    style[formattedProperty] = value.trim();
  });

  return style;
};
