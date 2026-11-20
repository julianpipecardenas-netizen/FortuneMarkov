import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('dashboard', () => {
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
    expect(screen.getAllByText('Treasure Hour').length).toBeGreaterThan(0)
  })

  it('muestra la advertencia teórica y los límites conjuntos', () => {
    render(<App />)
    expect(screen.getByText(/No confirman el funcionamiento real/)).toBeInTheDocument()
    expect(screen.getByText(/No se simula el botín completo/)).toBeInTheDocument()
  })
})
