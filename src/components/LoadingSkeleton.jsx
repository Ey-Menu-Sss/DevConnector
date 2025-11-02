import React from 'react';
import '../styles/components/_loading.scss';

export const PostSkeleton = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton_post_card" key={index}>
          <div className="skeleton_avatar"></div>
          <div className="skeleton_content">
            <div className="skeleton_name"></div>
            <div className="skeleton_text skeleton_text_long"></div>
            <div className="skeleton_text skeleton_text_medium"></div>
            <div className="skeleton_date"></div>
            <div className="skeleton_buttons">
              <div className="skeleton_button"></div>
              <div className="skeleton_button"></div>
              <div className="skeleton_button"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export const ProfileCardSkeleton = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton_profile_card" key={index}>
          <div className="skeleton_profile_avatar"></div>
          <div className="skeleton_profile_content">
            <div className="skeleton_profile_name"></div>
            <div className="skeleton_profile_info"></div>
            <div className="skeleton_profile_info skeleton_profile_info_short"></div>
            <div className="skeleton_profile_button"></div>
          </div>
          <div className="skeleton_skills">
            <div className="skeleton_skill"></div>
            <div className="skeleton_skill"></div>
            <div className="skeleton_skill"></div>
            <div className="skeleton_skill"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export const CommentSkeleton = ({ count = 2 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton_comment_card" key={index}>
          <div className="skeleton_comment_avatar"></div>
          <div className="skeleton_comment_content">
            <div className="skeleton_comment_header">
              <div className="skeleton_comment_name"></div>
              <div className="skeleton_comment_date"></div>
            </div>
            <div className="skeleton_comment_text"></div>
            <div className="skeleton_comment_text skeleton_comment_text_short"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export const UserProfileSkeleton = () => {
  return (
    <div className="skeleton_user_profile">
      <div className="skeleton_user_header">
        <div className="skeleton_user_avatar_large"></div>
        <div className="skeleton_user_name"></div>
        <div className="skeleton_user_company"></div>
      </div>
      <div className="skeleton_user_bio">
        <div className="skeleton_user_section_title"></div>
        <div className="skeleton_user_text"></div>
        <div className="skeleton_user_text"></div>
      </div>
      <div className="skeleton_user_skills">
        <div className="skeleton_user_section_title"></div>
        <div className="skeleton_skills_container">
          <div className="skeleton_skill"></div>
          <div className="skeleton_skill"></div>
          <div className="skeleton_skill"></div>
          <div className="skeleton_skill"></div>
          <div className="skeleton_skill"></div>
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="skeleton_dashboard">
      <div className="skeleton_dashboard_title"></div>
      <div className="skeleton_dashboard_cards">
        <div className="skeleton_dashboard_card"></div>
        <div className="skeleton_dashboard_card"></div>
        <div className="skeleton_dashboard_card"></div>
      </div>
      <div className="skeleton_dashboard_section">
        <div className="skeleton_dashboard_section_title"></div>
        <div className="skeleton_dashboard_item"></div>
        <div className="skeleton_dashboard_item"></div>
      </div>
    </div>
  );
};

