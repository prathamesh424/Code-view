export type VisualizerTab = 'debugger' | 'engine';

export interface VisualizerState {
  activeTab: VisualizerTab;
  isPlaying: boolean;
  speed: number; // 0.5x to 4x
  currentStepIndex: number;
  totalSteps: number;
}
