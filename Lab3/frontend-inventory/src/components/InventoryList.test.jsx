import { jest } from '@jest/globals'; 
import { render, screen, waitFor } from '@testing-library/react'; 
import InventoryList from './InventoryList'; 
 
const originalFetch = global.fetch; 
 
beforeEach(() => { 
  global.fetch = jest.fn().mockResolvedValue({ 
    ok: true, 
    status: 200, 
    json: async () => ({ 
      success: true, 
      data: [ 
        { id: '1', name: 'Серверна стійка', quantity: 3 }, 
        { id: '2', name: 'Маршрутизатор', quantity: 15 }, 
      ], 
    }), 
  }); 
}); 
 
afterEach(() => { 
  global.fetch = originalFetch; 
}); 
 
describe('Компонент InventoryList', () => { 
  test('відображає список після завантаження', async () => { 
    render(<InventoryList />); 
 
    expect(screen.getByText('Завантаження інвентарю...')) 
      .toBeInTheDocument(); 
 
    await waitFor(() => { 
      expect(screen.getByText(/Серверна стійка/i)) 
        .toBeInTheDocument(); 
    }); 
 
    expect(screen.getByText(/15 шт./i)).toBeInTheDocument(); 
    expect(global.fetch).toHaveBeenCalledTimes(1); 
  }); 
}); 