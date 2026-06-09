import * as React from 'react'
import { useTranslation } from 'react-i18next'
import Link from '@/next/link'
import { defaultFooterConfig, loadFooterConfig } from './footer-config-loader'

type CustomLinkProps = {
  href: string
  children: React.ReactNode
}

const CustomLink = React.memo(({
  href,
  children,
}: CustomLinkProps) => {
  return (
    <Link
      className="flex size-8 cursor-pointer items-center justify-center transition-opacity duration-200 ease-in-out hover:opacity-80"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      {children}
    </Link>
  )
})

const Footer = () => {
  const { t } = useTranslation()
  const [footerConfig, setFooterConfig] = React.useState(defaultFooterConfig)

  React.useEffect(() => {
    let isMounted = true

    const loadConfig = async () => {
      const config = await loadFooterConfig()
      if (isMounted)
        setFooterConfig(config)
    }

    loadConfig()

    return () => {
      isMounted = false
    }
  }, [])

  const footerStyle = React.useMemo<React.CSSProperties>(() => ({
    ...(footerConfig.backgroundColor ? { backgroundColor: footerConfig.backgroundColor } : {}),
  }), [footerConfig.backgroundColor])

  const footerText = footerConfig.text || t('communityIntro', { ns: 'app' })
  const textStyle = footerConfig.textColor ? { color: footerConfig.textColor } : undefined

  return (
    <footer className="relative shrink-0 grow-0 px-12 py-2" style={footerStyle}>
      <h3 className="text-gradient text-xl/tight font-semibold">{t('join', { ns: 'app' })}</h3>
      <p className="mt-1 system-sm-regular text-text-tertiary" style={textStyle}>{footerText}</p>
      <div className="mt-3 flex items-center gap-2">
        {footerConfig.links.map(link => (
          <CustomLink key={link.url} href={link.url}>
            <span className="system-sm-medium text-text-tertiary" style={textStyle}>{link.label}</span>
          </CustomLink>
        ))}
      </div>
      {footerConfig.copyright && (
        <p className="mt-2 system-xs-regular text-text-quaternary" style={textStyle}>{footerConfig.copyright}</p>
      )}
    </footer>
  )
}

export default React.memo(Footer)
