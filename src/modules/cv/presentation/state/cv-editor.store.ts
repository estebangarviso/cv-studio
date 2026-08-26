'use client';

import { create } from 'zustand';

interface CvEditorState {
  isDirty: boolean;
  activeSection: string | null;
  setDirty: (dirty: boolean) => void;
  setActiveSection: (section: string | null) => void;
}

export const useCvEditorStore = create<CvEditorState>((set) => ({
  isDirty: false,
  activeSection: null,
  setDirty: (dirty) => set({ isDirty: dirty }),
  setActiveSection: (section) => set({ activeSection: section }),
}));
