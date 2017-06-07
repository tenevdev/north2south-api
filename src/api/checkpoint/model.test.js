import { Checkpoint } from '.'
import * as socket from './socket'

const ioMock = {
  emit: jest.fn()
}

socket.setUpSocketRoom(ioMock)

let checkpoint

beforeEach(async () => {
  checkpoint = await Checkpoint.create({ heartRate: 67 })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = checkpoint.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(checkpoint.id)
    expect(view.heartRate).toBe(checkpoint.heartRate)
  })

  it('returns full view', () => {
    const view = checkpoint.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(checkpoint.id)
    expect(view.heartRate).toBe(checkpoint.heartRate)
  })
})
