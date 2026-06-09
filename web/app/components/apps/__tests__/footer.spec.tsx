import { render, screen, waitFor } from '@testing-library/react'
import * as React from 'react'
import Footer from '../footer'

describe('Footer', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    fetchMock = vi.fn().mockResolvedValue({ ok: false })
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Footer />)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('should display the community heading', () => {
      render(<Footer />)
      expect(screen.getByText('app.join')).toBeInTheDocument()
    })

    it('should display the community intro text', () => {
      render(<Footer />)
      expect(screen.getByText('app.communityIntro')).toBeInTheDocument()
    })
  })

  describe('Links', () => {
    it('should render GitHub link with correct href', () => {
      const { container } = render(<Footer />)
      const githubLink = container.querySelector('a[href="https://github.com/langgenius/dify"]')
      expect(githubLink).toBeInTheDocument()
    })

    it('should render Discord link with correct href', () => {
      const { container } = render(<Footer />)
      const discordLink = container.querySelector('a[href="https://discord.gg/FngNHpbcY7"]')
      expect(discordLink).toBeInTheDocument()
    })

    it('should render Forum link with correct href', () => {
      const { container } = render(<Footer />)
      const forumLink = container.querySelector('a[href="https://forum.dify.ai"]')
      expect(forumLink).toBeInTheDocument()
    })

    it('should have 3 community links', () => {
      render(<Footer />)
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(3)
    })

    it('should open links in new tab', () => {
      render(<Footer />)
      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })
  })

  describe('Styling', () => {
    it('should have correct footer styling', () => {
      render(<Footer />)
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('relative', 'shrink-0', 'grow-0')
    })

    it('should have gradient text styling on heading', () => {
      render(<Footer />)
      const heading = screen.getByText('app.join')
      expect(heading).toHaveClass('text-gradient')
    })
  })

  describe('Config Loading', () => {
    it('should load footer.conf with the expected path', async () => {
      render(<Footer />)

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith('/footer.conf')
      })
    })

    it('should render custom config values when footer.conf is valid', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          text: 'Custom footer text',
          links: [{ label: 'Docs', url: 'https://docs.example.com' }],
          copyright: '© 2026 Example',
          backgroundColor: '#111111',
          textColor: '#f5f5f5',
        }),
      })

      const { container } = render(<Footer />)

      await waitFor(() => {
        expect(screen.getByText('Custom footer text')).toBeInTheDocument()
      })

      const customLink = container.querySelector('a[href="https://docs.example.com"]')
      expect(customLink).toBeInTheDocument()
      expect(screen.getByText('© 2026 Example')).toBeInTheDocument()

      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveStyle({ backgroundColor: '#111111' })
      expect(screen.getByText('Custom footer text')).toHaveStyle({ color: '#f5f5f5' })
    })

    it('should fallback to default values when footer.conf format is invalid', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          text: 123,
          links: [{ label: 'Broken' }],
          copyright: false,
          backgroundColor: [],
          textColor: {},
        }),
      })

      const { container } = render(<Footer />)

      await waitFor(() => {
        expect(screen.getByText('app.communityIntro')).toBeInTheDocument()
      })

      const githubLink = container.querySelector('a[href="https://github.com/langgenius/dify"]')
      expect(githubLink).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle multiple renders without issues', () => {
      const { rerender } = render(<Footer />)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()

      rerender(<Footer />)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })
  })
})
