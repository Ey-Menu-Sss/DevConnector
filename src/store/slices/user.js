import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userAllInfo: JSON.parse(localStorage.getItem("userallinfo")) || [],
  userdatas: JSON.parse(localStorage.getItem("experiences")) || [],
  educations: JSON.parse(localStorage.getItem("educations")) || [],
  like: JSON.parse(localStorage.getItem("like")) || [],
  postsLike: JSON.parse(localStorage.getItem("postslike")) || [],
  allposts: JSON.parse(localStorage.getItem("allposts")) || [],
};
// JSON.parse(localStorage.getItem("experiences")) ||

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    UserAllInfo(state, action) {
      state.userAllInfo.push(action.payload);
    },
    Experience(state, action) {
      // Replace with all experiences from backend
      state.userdatas = [action.payload];
      localStorage.setItem("experiences", JSON.stringify(state.userdatas));
    },
    Education(state, action) {
      // Replace with all educations from backend
      state.educations = [action.payload];
      localStorage.setItem("educations", JSON.stringify(state.educations));
    },
    Like(state, action) {
      state.like.shift();
      state.like.push(action.payload);
      localStorage.setItem("like", JSON.stringify(state.like));
    },
    PostsLike(state, action) {
      state.postsLike.shift();
      state.postsLike.push(action.payload);
      localStorage.setItem("postslike", JSON.stringify(state.postsLike));
    },
    Allposts(state, action){
      // state.allposts.shift()
      state.allposts.push(action.payload)
      localStorage.setItem("allposts", JSON.stringify(state.allposts))
    }
  },
});

export default userSlice.reducer;
export const { Experience, Education, Like, PostsLike, UserAllInfo, Allposts } = userSlice.actions;
