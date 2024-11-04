import { expect, test, vi } from 'vitest'
import { getTeaByName, saveTea, generateNewTeaId } from './saver'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

// Mock
vi.mock('node:fs')
const mockTeaList = [
  { id: 1, name: 'Green Tea', description: 'A relaxing green tea' },
  { id: 2, name: 'Black Tea', description: 'A strong black tea' }
]

test('getTeaByName returns the Tea if it exists', () => {
  // Arrange
  existsSync.mockReturnValue(true)
  readFileSync.mockReturnValue(JSON.stringify(mockTeaList))

  // Act
  const tea = getTeaByName('Green Tea')

  // Assert
  expect(tea).toEqual(mockTeaList[0])
})

test('getTeaByName should return undefined if the Tea does not exist', () => {
  // Arrange
  existsSync.mockReturnValue(true)
  readFileSync.mockReturnValue(JSON.stringify(mockTeaList))

  // Act
  const tea = getTeaByName('Grey Tea')

  // Assert
  expect(tea).toBeUndefined()
})

test('saveTea fail if Tea name already exists', () => {
  // Arrange
  existsSync.mockReturnValue(true)
  readFileSync.mockReturnValue(JSON.stringify(mockTeaList))
  
  const duplicateTea = { id: 3, name: 'Green Tea', description: 'Another green tea' }

  // Act & Assert
  expect(() => saveTea(duplicateTea)).toThrowError('Tea with name Green Tea already exists')
})

test('saveTea fail if Tea id already exists', () => {
  // Arrange
  existsSync.mockReturnValue(true)
  readFileSync.mockReturnValue(JSON.stringify(mockTeaList))
  
  const duplicateIdTea = { id: 1, name: 'White Tea', description: 'A delicate white tea' }

  // Act & Assert
  expect(() => saveTea(duplicateIdTea)).toThrowError('Tea with id 1 already exists')
})

test('saveTea should save a new tea if it does not already exist', () => {
    // Arrange
    existsSync.mockReturnValue(true)
    readFileSync.mockReturnValue(JSON.stringify(mockTeaList))
    
    const newTea = { id: 3, name: 'Grey Tea', description: 'A rich Grey tea' }
  
    // Act
    saveTea(newTea)
  
    // Assert
    const updatedTeaList = [...mockTeaList, newTea]
    expect(writeFileSync).toHaveBeenCalledWith('data.json', JSON.stringify(updatedTeaList, null, 2))
})

test('generateNewTeaId should generate a unique id', () => {
  // Arrange
  const mockDateNow = vi.spyOn(Date, 'now')
  mockDateNow.mockReturnValueOnce(1000).mockReturnValueOnce(2000) // Simule deux timestamps différents

  // Act
  const id1 = generateNewTeaId()
  const id2 = generateNewTeaId()

  // Assert
  expect(id1).not.toBe(id2)          // Les IDs doivent être uniques
  expect(typeof id1).toBe('number')   // Vérifie que c'est un nombre
  expect(typeof id2).toBe('number')

  // Clean up
  mockDateNow.mockRestore()
})