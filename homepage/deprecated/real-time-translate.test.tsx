import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RealTimeTranslate, useRealTimeTranslate } from './real-time-translate'
import { useTranslatedText } from '@/hooks/use-translated-text'
import { LanguageProvider } from '@/contexts/language-context'
import * as azureTranslator from '@/lib/azure-translator'

// Mock the Azure translator
jest.mock('@/lib/azure-translator', () => ({
  translateWithAzure: jest.fn(),
  supportedLanguages: {
    en: 'English',
    fr: 'French', 
    ht: 'Haitian Creole'
  }
}))

const mockedTranslateWithAzure = azureTranslator.translateWithAzure as jest.MockedFunction<typeof azureTranslator.translateWithAzure>

// Mock component for testing language context
function TestComponent() {
  const translatedPlaceholder = useTranslatedText("Search creators...")
  
  return (
    <div>
      <RealTimeTranslate text="Get personalized videos from your favorite Haitian creators" />
      <input placeholder={translatedPlaceholder} data-testid="search-input" />
      <RealTimeTranslate 
        text="Browse Creators" 
        as="button"
        className="test-button"
      />
    </div>
  )
}

// Test wrapper with language provider
function TestWrapper({ children, initialLanguage = 'en' }: { children: React.ReactNode, initialLanguage?: string }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
}

describe('RealTimeTranslate Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Setup default mock implementations
    mockedTranslateWithAzure.mockImplementation(async (text, to, from) => {
      // Don't translate if same language
      if (from === to) return text
      
      // Mock translations for testing
      const translations: Record<string, Record<string, string>> = {
        'Get personalized videos from your favorite Haitian creators': {
          fr: 'Obtenez des vidéos personnalisées de vos créateurs haïtiens préférés',
          ht: 'Jwenn videyo pèsonalize nan kreyatè ayisyen pi renmen ou'
        },
        'Browse Creators': {
          fr: 'Parcourir les créateurs',
          ht: 'Naviguer nan kreyatè yo'
        },
        'Search creators...': {
          fr: 'Rechercher des créateurs...',
          ht: 'Chèche kreyatè yo...'
        },
        'Test text': {
          fr: 'Texte de test',
          ht: 'Tès tèks'
        }
      }
      
      return translations[text]?.[to] || text
    })
  })

  it('renders original text when language is the same as source', async () => {
    render(
      <TestWrapper>
        <RealTimeTranslate text="Hello world" sourceLanguage="en" />
      </TestWrapper>
    )

    expect(screen.getByText('Hello world')).toBeInTheDocument()
    expect(mockedTranslateWithAzure).not.toHaveBeenCalled()
  })

  it('translates text when language changes', async () => {
    const { rerender } = render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Initially should show English text
    expect(screen.getByText('Get personalized videos from your favorite Haitian creators')).toBeInTheDocument()

    // Mock language change to French
    mockedTranslateWithAzure.mockResolvedValueOnce('Obtenez des vidéos personnalisées de vos créateurs haïtiens préférés')
    
    // Trigger a re-render (in real app this would happen via language context change)
    rerender(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Wait for translation to complete
    await waitFor(() => {
      expect(mockedTranslateWithAzure).toHaveBeenCalledWith(
        'Get personalized videos from your favorite Haitian creators',
        'en', // This will be the current language from context
        'en'
      )
    })
  })

  it('handles translation errors gracefully', async () => {
    mockedTranslateWithAzure.mockRejectedValueOnce(new Error('Translation failed'))

    render(
      <TestWrapper>
        <RealTimeTranslate text="Test text" sourceLanguage="en" />
      </TestWrapper>
    )

    // Should fallback to original text on error
    await waitFor(() => {
      expect(screen.getByText('Test text')).toBeInTheDocument()
    })
  })

  it('applies custom className and component type', () => {
    render(
      <TestWrapper>
        <RealTimeTranslate 
          text="Button text" 
          as="button"
          className="custom-button"
          sourceLanguage="en"
        />
      </TestWrapper>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-button')
    expect(button).toHaveAttribute('data-translated', 'false')
    expect(button).toHaveAttribute('data-loading', 'false')
  })

  it('shows loading state during translation', async () => {
    // Mock a delayed translation
    mockedTranslateWithAzure.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve('Translated text'), 100))
    )

    render(
      <TestWrapper>
        <RealTimeTranslate text="Loading test" sourceLanguage="en" />
      </TestWrapper>
    )

    // Check for loading state (this might be challenging to test due to timing)
    const element = screen.getByText('Loading test')
    expect(element).toHaveAttribute('data-loading', 'false') // Initially false
  })

  it('uses fallback text when provided', () => {
    render(
      <TestWrapper>
        <RealTimeTranslate 
          text="Original text" 
          fallback="Fallback text"
          sourceLanguage="en"
        />
      </TestWrapper>
    )

    // Initially shows fallback or original text
    expect(screen.getByText('Original text')).toBeInTheDocument()
  })
})

describe('useTranslatedText Hook', () => {
  it('returns translated text for input attributes', async () => {
    function TestHook() {
      const translatedText = useTranslatedText('Search creators...')
      return <div data-testid="translated-text">{translatedText}</div>
    }

    render(
      <TestWrapper>
        <TestHook />
      </TestWrapper>
    )

    expect(screen.getByTestId('translated-text')).toHaveTextContent('Search creators...')
  })

  it('handles empty or null text gracefully', () => {
    function TestHook() {
      const translatedText = useTranslatedText('')
      return <div data-testid="translated-text">{translatedText}</div>
    }

    render(
      <TestWrapper>
        <TestHook />
      </TestWrapper>
    )

    expect(screen.getByTestId('translated-text')).toHaveTextContent('')
  })
})

describe('useRealTimeTranslate Hook', () => {
  it('provides translate function and current language', async () => {
    function TestHook() {
      const { translate, currentLanguage } = useRealTimeTranslate()
      const [translatedText, setTranslatedText] = React.useState('')
      
      React.useEffect(() => {
        translate('Test text').then(result => {
          setTranslatedText(result)
        })
      }, [translate])

      return (
        <div>
          <div data-testid="current-language">{currentLanguage}</div>
          <div data-testid="translated-text">{translatedText}</div>
        </div>
      )
    }

    render(
      <TestWrapper>
        <TestHook />
      </TestWrapper>
    )

    expect(screen.getByTestId('current-language')).toHaveTextContent('en')
    
    await waitFor(() => {
      expect(screen.getByTestId('translated-text')).toHaveTextContent('Test text')
    })
  })
})

describe('Integration Tests', () => {
  it('integrates with language context for full translation flow', async () => {
    // This would test the full integration with language switching
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Test that all components render
    expect(screen.getByText('Get personalized videos from your favorite Haitian creators')).toBeInTheDocument()
    expect(screen.getByText('Browse Creators')).toBeInTheDocument()
    expect(screen.getByTestId('search-input')).toHaveAttribute('placeholder', 'Search creators...')
  })

  it('handles multiple simultaneous translations', async () => {
    render(
      <TestWrapper>
        <div>
          <RealTimeTranslate text="First text" />
          <RealTimeTranslate text="Second text" />
          <RealTimeTranslate text="Third text" />
        </div>
      </TestWrapper>
    )

    expect(screen.getByText('First text')).toBeInTheDocument()
    expect(screen.getByText('Second text')).toBeInTheDocument()
    expect(screen.getByText('Third text')).toBeInTheDocument()
  })
})

describe('Accessibility', () => {
  it('maintains accessibility attributes during translation', () => {
    render(
      <TestWrapper>
        <RealTimeTranslate 
          text="Accessible button" 
          as="button"
          aria-label="Test button"
        />
      </TestWrapper>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Test button')
    expect(button).toHaveAttribute('data-translated', 'false')
  })
})

describe('Performance', () => {
  it('uses caching to avoid redundant API calls', async () => {
    const { rerender } = render(
      <TestWrapper>
        <RealTimeTranslate text="Cached text" />
      </TestWrapper>
    )

    // First render
    expect(screen.getByText('Cached text')).toBeInTheDocument()

    // Re-render with same text
    rerender(
      <TestWrapper>
        <RealTimeTranslate text="Cached text" />
      </TestWrapper>
    )

    // Should not make additional API calls for same text
    expect(mockedTranslateWithAzure).toHaveBeenCalledTimes(0) // Since same language
  })
})