import persistReducer from "redux-persist/es/persistReducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createConfig } from "@/utils/redux.utils";
import { QuestionFormValues } from "@/app/dashboard/question/config";
import { UserType } from "@/types/types";

type InitialState = {
  selectedQuestion: QuestionFormValues | null;
  selectedUser: UserType | null;
};

const initialState: InitialState = {
  selectedQuestion: null,
  selectedUser: null,
};

const modelsSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setSelectedQuestion(
      state,
      action: PayloadAction<QuestionFormValues | null>
    ) {
      if (
        JSON.stringify(state.selectedQuestion) ===
        JSON.stringify(action.payload)
      ) {
        return;
      }
      state.selectedQuestion = action.payload;
    },
    setSelectedUser(state, action: PayloadAction<UserType | null>) {
      if (
        JSON.stringify(state.selectedQuestion) ===
        JSON.stringify(action.payload)
      ) {
        return;
      }
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

const persistedGeneralReducer = persistReducer(
  createConfig({
    key: "general",
    blacklist: ["selectedQuestion", "selectedUser"],
  }),
  modelsSlice.reducer
);

export const { setSelectedQuestion, setSelectedUser } = modelsSlice.actions;
export default persistedGeneralReducer;
