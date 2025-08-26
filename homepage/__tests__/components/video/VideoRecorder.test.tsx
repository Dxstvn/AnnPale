import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VideoRecorder } from '@/components/video/VideoRecorder'
import type { VideoRequest } from '@/types/video'

// Mock video request
const mockRequest: VideoRequest = {
  id: 'request-123',
  fan_id: 'fan-123',
  creator_id: 'creator-123',
  occasion: 'Birthday',
  recipient_name: 'John Doe',
  instructions: 'Please wish a happy birthday!',
  is_public: false,
  status: 'accepted',
  price_usd: 25,
  currency: 'USD',
  requested_at: new Date(),
  created_at: new Date(),
  updated_at: new Date()
}

describe('VideoRecorder Component', () => {
  let mockGetUserMedia: jest.Mock
  let mockEnumerateDevices: jest.Mock
  let mockMediaRecorder: any
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    
    // Setup getUserMedia mock
    mockGetUserMedia = jest.fn(() => 
      Promise.resolve(new MediaStream())
    )
    global.navigator.mediaDevices.getUserMedia = mockGetUserMedia
    
    // Setup enumerateDevices mock
    mockEnumerateDevices = jest.fn(() => 
      Promise.resolve([
        { deviceId: 'camera1', kind: 'videoinput', label: 'Camera 1', groupId: '', toJSON: () => {} },
        { deviceId: 'camera2', kind: 'videoinput', label: 'Camera 2', groupId: '', toJSON: () => {} },
        { deviceId: 'mic1', kind: 'audioinput', label: 'Microphone 1', groupId: '', toJSON: () => {} },
        { deviceId: 'mic2', kind: 'audioinput', label: 'Microphone 2', groupId: '', toJSON: () => {} },
      ])
    )
    global.navigator.mediaDevices.enumerateDevices = mockEnumerateDevices
    
    // Setup MediaRecorder mock
    mockMediaRecorder = {
      start: jest.fn(),
      stop: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      state: 'inactive',
      ondataavailable: null,
      onstop: null,
    }
    
    global.MediaRecorder = jest.fn(() => mockMediaRecorder) as any
    MediaRecorder.isTypeSupported = jest.fn(() => true)
  })
  
  it('should render without request', async () => {
    await act(async () => {
      render(<VideoRecorder />)
    })
    
    expect(screen.getByText('Video Recorder')).toBeInTheDocument()
    expect(screen.queryByText('Request #')).not.toBeInTheDocument()
  })
  
  it('should render with request details', async () => {
    await act(async () => {
      render(<VideoRecorder request={mockRequest} />)
    })
    
    // The component slices the ID to first 8 characters
    expect(screen.getByText(/Request #request-/)).toBeInTheDocument()
    expect(screen.getByText(/Recording for: John Doe/)).toBeInTheDocument()
    expect(screen.getByText(/Occasion: Birthday/)).toBeInTheDocument()
    expect(screen.getByText(/Please wish a happy birthday!/)).toBeInTheDocument()
  })
  
  it('should request media permissions on mount', async () => {
    await act(async () => {
      render(<VideoRecorder />)
    })
    
    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith(
        expect.objectContaining({
          video: expect.any(Object),
          audio: expect.any(Object)
        })
      )
    })
    
    expect(mockEnumerateDevices).toHaveBeenCalled()
  })
  
  it('should handle permission denied error', async () => {
    const error = new Error('Permission denied')
    error.name = 'NotAllowedError'
    mockGetUserMedia.mockRejectedValueOnce(error)
    
    await act(async () => {
      render(<VideoRecorder />)
    })
    
    await waitFor(() => {
      expect(screen.getByText(/Camera and microphone access denied/)).toBeInTheDocument()
    })
  })
  
  it('should start recording when button clicked', async () => {
    await act(async () => {
      render(<VideoRecorder />)
    })
    
    // Wait for initialization
    await waitFor(() => {
      expect(screen.getByText('Start Recording')).toBeEnabled()
    })
    
    const startButton = screen.getByText('Start Recording')
    
    await act(async () => {
      fireEvent.click(startButton)
    })
    
    expect(mockMediaRecorder.start).toHaveBeenCalledWith(1000)
    expect(screen.getByText('Stop')).toBeInTheDocument()
  })
  
  it('should stop recording and show playback controls', async () => {
    await act(async () => {
      render(<VideoRecorder />)
    })
    
    // Start recording
    await waitFor(() => {
      expect(screen.getByText('Start Recording')).toBeEnabled()
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Start Recording'))
    })
    
    // Mock recording state
    mockMediaRecorder.state = 'recording'
    
    // Stop recording
    await act(async () => {
      fireEvent.click(screen.getByText('Stop'))
    })
    
    expect(mockMediaRecorder.stop).toHaveBeenCalled()
    
    // Simulate MediaRecorder onstop callback
    await act(async () => {
      if (mockMediaRecorder.onstop) {
        mockMediaRecorder.onstop()
      }
    })
    
    // Should show playback controls
    await waitFor(() => {
      expect(screen.getByText('Record Again')).toBeInTheDocument()
      expect(screen.getByText('Download')).toBeInTheDocument()
    })
  })
  
  it('should pause and resume recording', async () => {
    await act(async () => {
      render(<VideoRecorder />)
    })
    
    // Start recording
    await waitFor(() => {
      expect(screen.getByText('Start Recording')).toBeEnabled()
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Start Recording'))
    })
    
    mockMediaRecorder.state = 'recording'
    
    // Pause recording
    const pauseButton = screen.getByText('Pause')
    await act(async () => {
      fireEvent.click(pauseButton)
    })
    
    expect(mockMediaRecorder.pause).toHaveBeenCalled()
    expect(screen.getByText('Resume')).toBeInTheDocument()
    
    mockMediaRecorder.state = 'paused'
    
    // Resume recording
    await act(async () => {
      fireEvent.click(screen.getByText('Resume'))
    })
    
    expect(mockMediaRecorder.resume).toHaveBeenCalled()
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })
  
  it('should toggle video and audio', async () => {
    // Create mock tracks that can be properly toggled
    const mockVideoTrack = { 
      enabled: true, 
      stop: jest.fn() 
    }
    const mockAudioTrack = { 
      enabled: true, 
      stop: jest.fn() 
    }
    
    const mockStream = {
      getTracks: jest.fn(() => [mockVideoTrack, mockAudioTrack]),
      getVideoTracks: jest.fn(() => [mockVideoTrack]),
      getAudioTracks: jest.fn(() => [mockAudioTrack]),
      addTrack: jest.fn(),
      removeTrack: jest.fn(),
    }
    
    mockGetUserMedia.mockResolvedValue(mockStream as any)
    
    await act(async () => {
      render(<VideoRecorder />)
    })
    
    // Wait for component to initialize with stream
    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalled()
    })
    
    // Wait for buttons to be ready
    await waitFor(() => {
      expect(screen.getByText('Start Recording')).toBeEnabled()
    })
    
    // Get toggle buttons
    const buttons = screen.getAllByRole('button')
    const toggleButtons = buttons.filter(btn => 
      !btn.textContent?.includes('Start Recording')
    )
    
    expect(toggleButtons.length).toBeGreaterThanOrEqual(2)
    
    // Test video toggle functionality
    expect(mockVideoTrack.enabled).toBe(true)
    
    await act(async () => {
      fireEvent.click(toggleButtons[0])
    })
    
    // Verify the track was actually disabled
    expect(mockVideoTrack.enabled).toBe(false)
    
    // Toggle back on
    await act(async () => {
      fireEvent.click(toggleButtons[0])
    })
    
    expect(mockVideoTrack.enabled).toBe(true)
    
    // Test audio toggle functionality
    expect(mockAudioTrack.enabled).toBe(true)
    
    await act(async () => {
      fireEvent.click(toggleButtons[1])
    })
    
    // Verify the track was actually disabled
    expect(mockAudioTrack.enabled).toBe(false)
  })
  
  it('should call onRecordingComplete callback', async () => {
    const onRecordingComplete = jest.fn()
    
    await act(async () => {
      render(<VideoRecorder onRecordingComplete={onRecordingComplete} />)
    })
    
    // Start recording
    await waitFor(() => {
      expect(screen.getByText('Start Recording')).toBeEnabled()
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Start Recording'))
    })
    
    // Simulate data available
    const mockBlob = new Blob(['video data'], { type: 'video/webm' })
    await act(async () => {
      if (mockMediaRecorder.ondataavailable) {
        mockMediaRecorder.ondataavailable({ data: mockBlob })
      }
    })
    
    // Stop recording
    await act(async () => {
      fireEvent.click(screen.getByText('Stop'))
    })
    
    // Simulate onstop
    await act(async () => {
      if (mockMediaRecorder.onstop) {
        mockMediaRecorder.onstop()
      }
    })
    
    expect(onRecordingComplete).toHaveBeenCalledWith(
      expect.any(Blob),
      expect.any(Number)
    )
  })
  
  it('should handle upload when onUpload provided', async () => {
    const onUpload = jest.fn(() => Promise.resolve())
    
    await act(async () => {
      render(<VideoRecorder onUpload={onUpload} />)
    })
    
    // Record a video
    await waitFor(() => {
      expect(screen.getByText('Start Recording')).toBeEnabled()
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Start Recording'))
    })
    
    const mockBlob = new Blob(['video data'], { type: 'video/webm' })
    await act(async () => {
      if (mockMediaRecorder.ondataavailable) {
        mockMediaRecorder.ondataavailable({ data: mockBlob })
      }
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Stop'))
    })
    
    await act(async () => {
      if (mockMediaRecorder.onstop) {
        mockMediaRecorder.onstop()
      }
    })
    
    // Should show upload button
    await waitFor(() => {
      expect(screen.getByText('Upload Video')).toBeInTheDocument()
    })
    
    // Click upload
    await act(async () => {
      fireEvent.click(screen.getByText('Upload Video'))
    })
    
    await waitFor(() => {
      expect(onUpload).toHaveBeenCalledWith(expect.any(Blob))
    })
  })
  
  it('should handle upload error', async () => {
    const onUpload = jest.fn(() => Promise.reject(new Error('Upload failed')))
    
    await act(async () => {
      render(<VideoRecorder onUpload={onUpload} />)
    })
    
    // Record a video
    await waitFor(() => {
      expect(screen.getByText('Start Recording')).toBeEnabled()
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Start Recording'))
    })
    
    const mockBlob = new Blob(['video data'], { type: 'video/webm' })
    await act(async () => {
      if (mockMediaRecorder.ondataavailable) {
        mockMediaRecorder.ondataavailable({ data: mockBlob })
      }
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Stop'))
    })
    
    await act(async () => {
      if (mockMediaRecorder.onstop) {
        mockMediaRecorder.onstop()
      }
    })
    
    // Click upload
    await act(async () => {
      fireEvent.click(screen.getByText('Upload Video'))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Upload failed')).toBeInTheDocument()
    })
  })
  
  it('should enforce maximum duration', async () => {
    jest.useFakeTimers()
    
    await act(async () => {
      render(<VideoRecorder maxDuration={3} />)
    })
    
    // Start recording
    await waitFor(() => {
      expect(screen.getByText('Start Recording')).toBeEnabled()
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Start Recording'))
    })
    
    mockMediaRecorder.state = 'recording'
    
    // Fast-forward time
    await act(async () => {
      jest.advanceTimersByTime(3000)
    })
    
    // Recording should auto-stop at max duration
    expect(mockMediaRecorder.stop).toHaveBeenCalled()
    
    jest.useRealTimers()
  })
  
  it('should allow device selection', async () => {
    await act(async () => {
      render(<VideoRecorder />)
    })
    
    await waitFor(() => {
      expect(screen.getByText('Camera')).toBeInTheDocument()
      expect(screen.getByText('Microphone')).toBeInTheDocument()
    })
    
    // Find select elements - they don't have labels with htmlFor
    // so we need to find them by role
    const selects = screen.getAllByRole('combobox')
    
    // Should have 2 select elements (camera and microphone)
    expect(selects).toHaveLength(2)
    
    // First select should be camera
    const cameraSelect = selects[0]
    expect(cameraSelect).toBeInTheDocument()
    expect(cameraSelect.querySelectorAll('option')).toHaveLength(2)
    
    // Second select should be microphone
    const micSelect = selects[1]
    expect(micSelect).toBeInTheDocument()
    expect(micSelect.querySelectorAll('option')).toHaveLength(2)
  })
  
  it('should handle download recording', async () => {
    // Mock URL and document methods
    const mockCreateElement = jest.spyOn(document, 'createElement')
    const mockAppendChild = jest.spyOn(document.body, 'appendChild')
    const mockRemoveChild = jest.spyOn(document.body, 'removeChild')
    const mockClick = jest.fn()
    
    await act(async () => {
      render(<VideoRecorder />)
    })
    
    // Record a video
    await waitFor(() => {
      expect(screen.getByText('Start Recording')).toBeEnabled()
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Start Recording'))
    })
    
    const mockBlob = new Blob(['video data'], { type: 'video/webm' })
    await act(async () => {
      if (mockMediaRecorder.ondataavailable) {
        mockMediaRecorder.ondataavailable({ data: mockBlob })
      }
    })
    
    await act(async () => {
      fireEvent.click(screen.getByText('Stop'))
    })
    
    await act(async () => {
      if (mockMediaRecorder.onstop) {
        mockMediaRecorder.onstop()
      }
    })
    
    // Mock the anchor element
    mockCreateElement.mockImplementationOnce(() => {
      const a = document.createElement('a')
      a.click = mockClick
      return a
    })
    
    // Click download
    await act(async () => {
      fireEvent.click(screen.getByText('Download'))
    })
    
    expect(mockClick).toHaveBeenCalled()
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
    expect(URL.revokeObjectURL).toHaveBeenCalled()
    
    // Cleanup
    mockCreateElement.mockRestore()
    mockAppendChild.mockRestore()
    mockRemoveChild.mockRestore()
  })
})