import { expect, test, vi } from 'vitest'
import { addTea } from './index'
import { getTeaByName, saveTea, generateNewTeaId } from './saver'

// Mock
vi.mock('./saver', () => ({
  getTeaByName: vi.fn(),
  saveTea: vi.fn(),
  generateNewTeaId: vi.fn()
}))

test('addTea should create a new tea', () => {
  // Arrange
  getTeaByName.mockReturnValue(undefined)
  generateNewTeaId.mockReturnValue(3)
  const teaDto = { name: 'Oolong Tea', description: 'A rich oolong tea' }

  // Act
  const result = addTea(teaDto)

  // Assert
  expect(saveTea).toHaveBeenCalledWith({ id: 3, ...teaDto })
  expect(result).toEqual({ success: true })
})

test('addTea should succeed if saveTea succeeds', () => {
  // Arrange
  getTeaByName.mockReturnValue(undefined)
  generateNewTeaId.mockReturnValue(4)
  const teaDto = { name: 'White Tea', description: 'A delicate white tea' }

  // Act
  const result = addTea(teaDto)

  // Assert
  expect(result).toEqual({ success: true })
})

test('addTea should fail if saveTea throws an error', () => {
  // Arrange
  getTeaByName.mockReturnValue(undefined)
  generateNewTeaId.mockReturnValue(5)
  saveTea.mockImplementation(() => { throw new Error('Save failed') })
  const teaDto = { name: 'Black Tea', description: 'A strong black tea' }

  // Act
  const result = addTea(teaDto)

  // Assert
  expect(result).toEqual({ success: false })
})
