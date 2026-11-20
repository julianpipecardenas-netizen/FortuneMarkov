import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { formatFraction, rewards, sourceReferences } from './data/rewards'
import App, { percent } from './App'

describe('dashboard', () => {
  it('formatea porcentajes pequeños y grandes sin notación científica', () => {
    expect(percent(1 / 1_562_500)).toBe('0,000064 %')
    expect(percent(1e-9)).toBe('0,0000001 %')
    expect(percent(1 / 127)).toBe('0,787402 %')
    expect(percent(0.99999936)).toBe('99,999936 %')
    expect(percent(1)).toBe('100 %')

    render(<App />)
    const metric = screen.getByText('Tasa individual por apertura').closest('article')
    expect(metric).toHaveTextContent('0,000064 %')
  })

  it('diferencia la tasa individual de la estimación acumulada', () => {
    render(<App />)
    expect(screen.getByText('Tasa individual por apertura')).toBeInTheDocument()
    expect(screen.getByText('Probabilidad acumulada estimada')).toBeInTheDocument()
  })

  it('permite cambiar recompensa y escenario', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Recompensa'), {
      target: { value: 'gizmo' },
    })
    fireEvent.change(screen.getByLabelText('Escenario'), {
      target: { value: 'treasure-hour' },
    })
    expect(screen.getAllByText('Hora del tesoro').length).toBeGreaterThan(0)
    expect(
      within(screen.getByRole('table', { name: 'Alternativa textual del gráfico' })).getByRole(
        'columnheader',
        { name: 'Hora del tesoro' },
      ),
    ).toBeInTheDocument()
  })

  it('muestra en español los estados y aclara el significado de cofre sin recompensa', () => {
    render(<App />)
    expect(screen.getByText('Cofre sin recompensa')).toBeInTheDocument()
    expect(screen.getByText('Recompensa obtenida')).toBeInTheDocument()
    expect(screen.getByText(/no significa que el cofre esté vacío/)).toBeInTheDocument()
    expect(screen.queryByText('Not Obtained')).not.toBeInTheDocument()
    expect(screen.queryByText('Obtained')).not.toBeInTheDocument()
    expect(screen.queryByText('Treasure Hour')).not.toBeInTheDocument()
  })

  it('muestra cada imagen junto al nombre de su recompensa en el catálogo', () => {
    render(<App />)
    const catalog = screen.getByRole('heading', { name: 'Catálogo de recompensas' }).closest('section')
    expect(catalog).not.toBeNull()

    for (const reward of rewards) {
      expect(within(catalog as HTMLElement).getByText(reward.name)).toBeInTheDocument()
      expect(
        within(catalog as HTMLElement).getByRole('img', {
          name: `Imagen de ${reward.name}`,
        }),
      ).toHaveAttribute('src', reward.imageSrc)
    }
  })

  it('reutiliza la imagen seleccionada junto al selector y en el simulador', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Recompensa'), {
      target: { value: 'gizmo' },
    })

    const images = screen.getAllByRole('img', { name: 'Imagen de Cualquier artilugio' })
    expect(images).toHaveLength(3)
    for (const image of images) {
      expect(image).toHaveAttribute('src', '/images/rewards/any-gizmo.webp')
    }
  })

  it('muestra un destello dorado accesible si una imagen no se puede cargar', () => {
    render(<App />)
    fireEvent.error(screen.getAllByRole('img', { name: 'Imagen de Traje dorado semanal' })[0])

    expect(
      screen.getByRole('img', { name: 'Imagen no disponible para Traje dorado semanal' }),
    ).toHaveClass('reward-thumbnail-fallback')
  })

  it('muestra las fracciones originales con agrupación uniforme en el catálogo', () => {
    render(<App />)
    const catalog = screen.getByRole('heading', { name: 'Catálogo de recompensas' }).closest('section')
    expect(catalog).not.toBeNull()

    for (const reward of rewards) {
      const row = within(catalog as HTMLElement)
        .getByText(reward.name)
        .closest('tr')
      expect(row).not.toBeNull()
      expect(row).toHaveTextContent(formatFraction(reward.rates.normal))
      expect(row).toHaveTextContent(formatFraction(reward.rates['treasure-hour']))
    }
  })

  it('distingue la publicación normal de la fracción derivada y enlaza las fuentes', () => {
    render(<App />)
    const catalog = screen.getByRole('heading', { name: 'Catálogo de recompensas' }).closest('section')
    expect(catalog).not.toBeNull()
    const publishedLabels = within(catalog as HTMLElement).getAllByText(
      'Fuente: Epic Games; tasa publicada (verificada)',
    )
    const derivedLabels = within(catalog as HTMLElement).getAllByText(
      'Fuente: Epic Games; fracción derivada de multiplicador publicado (verificada)',
    )
    expect(publishedLabels).toHaveLength(7)
    expect(derivedLabels).toHaveLength(7)

    expect(screen.getByRole('link', { name: 'Epic Games' })).toHaveAttribute(
      'href',
      sourceReferences.epicGames.url,
    )
    expect(screen.getByRole('link', { name: 'Fortnite.GG' })).toHaveAttribute(
      'href',
      sourceReferences.fortniteGG.url,
    )
    expect(screen.queryByText(/verificación independiente pendiente/)).not.toBeInTheDocument()
  })

  it('muestra la advertencia teórica y los límites conjuntos', () => {
    render(<App />)
    expect(screen.getByText(/No confirman el funcionamiento real/)).toBeInTheDocument()
    expect(screen.getByText(/No se simula el botín completo/)).toBeInTheDocument()
  })
})
