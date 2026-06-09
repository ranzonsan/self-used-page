export type FooterLinkConfig = {
  label: string
  url: string
}

export type FooterConfig = {
  text: string
  links: FooterLinkConfig[]
  copyright: string
  backgroundColor: string
  textColor: string
}

export const defaultFooterConfig: FooterConfig = {
  text: '',
  links: [
    { label: 'GitHub', url: 'https://github.com/langgenius/dify' },
    { label: 'Discord', url: 'https://discord.gg/FngNHpbcY7' },
    { label: 'Forum', url: 'https://forum.dify.ai' },
  ],
  copyright: '',
  backgroundColor: '',
  textColor: '',
}

const isValidLink = (value: unknown): value is FooterLinkConfig => {
  if (!value || typeof value !== 'object')
    return false

  const { label, url } = value as FooterLinkConfig
  return typeof label === 'string' && typeof url === 'string'
}

const normalizeFooterConfig = (value: unknown): FooterConfig => {
  if (!value || typeof value !== 'object')
    return defaultFooterConfig

  const config = value as Partial<FooterConfig>
  const validLinks = Array.isArray(config.links)
    ? config.links.filter(isValidLink)
    : defaultFooterConfig.links

  return {
    text: typeof config.text === 'string' ? config.text : defaultFooterConfig.text,
    links: validLinks.length ? validLinks : defaultFooterConfig.links,
    copyright: typeof config.copyright === 'string' ? config.copyright : defaultFooterConfig.copyright,
    backgroundColor: typeof config.backgroundColor === 'string' ? config.backgroundColor : defaultFooterConfig.backgroundColor,
    textColor: typeof config.textColor === 'string' ? config.textColor : defaultFooterConfig.textColor,
  }
}

export const loadFooterConfig = async (): Promise<FooterConfig> => {
  try {
    const response = await fetch('/footer.conf')
    if (!response.ok)
      return defaultFooterConfig

    const config = await response.json()
    return normalizeFooterConfig(config)
  }
  catch {
    return defaultFooterConfig
  }
}
