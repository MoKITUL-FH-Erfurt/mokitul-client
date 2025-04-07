import { create } from "zustand";

export enum Layout {
  block = "block",
  standalone = "standalone",
}

interface SettingsState {
  serviceUrl: string;
  setServiceUrl: (url: string) => void;
  useMock: boolean;
  setUseMock: (useMock: boolean) => void;
  loadSettings: () => void;
  file: string | undefined;
  setFile: (file: string) => void;
  course: string | undefined;
  setCourse: (course: string) => void;
  getSearchParams: () => URLSearchParams;
  layout: Layout;
  setLayout: (layout: Layout) => void;
  getLayout: () => Layout;
  getScope: () => string;
}

const mapLayoutToScope = (layout: Layout) => {
  switch (layout) {
    case Layout.block:
      return "course";
    case Layout.standalone:
      return "file";
  }
};

const useSettingsStore = create<SettingsState>((set) => ({
  serviceUrl: "",
  setServiceUrl: (url: string) => set({ serviceUrl: url }),
  useMock: false,
  setUseMock: (useMock: boolean) => set({ useMock }),
  loadSettings: () => {
    const { apiUrl, useMocks } = import.meta.env;

    const serviceUrl = apiUrl ? apiUrl : "http://localhost:8000";
    const useMockData = useMocks ? useMocks : false;

    set({ serviceUrl, useMock: useMockData });
  },
  file: undefined,
  setFile: (file: string) => set({ file }),
  course: undefined,
  setCourse: (course: string) => set({ course }),
  getSearchParams: () => {
    const searchParams = new URLSearchParams();
    const course = useSettingsStore.getState().course;
    const file = useSettingsStore.getState().file;

    if (course) searchParams.append("courseId", course);
    if (file) searchParams.append("fileId", file);

    return searchParams;
  },
  layout: Layout.block,
  setLayout: (layout: Layout) => set({ layout }),
  getLayout: (): Layout => useSettingsStore.getState().layout,
  getScope: (): string => mapLayoutToScope(useSettingsStore.getState().layout),
}));

export default useSettingsStore;
