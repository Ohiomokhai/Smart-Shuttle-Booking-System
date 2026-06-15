import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Settings = () => {
  const { user_id } = useParams();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch(`/user-settings/${user_id}`);
      const data = await response.json();
      setNotificationsEnabled(data.notifications_enabled);
    };

    fetchSettings();
  }, [user_id]);

  const handleToggle = async () => {
    const newSettings = !notificationsEnabled;
    await fetch('http://localhost:5000/update-notification-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, notifications_enabled: newSettings })
    });
    setNotificationsEnabled(newSettings);
  };

  return (
    <div>
      <h2>Settings</h2>
      <label>
        <input type="checkbox" checked={notificationsEnabled} onChange={handleToggle} />
        Enable Notifications
      </label>
    </div>
  );
};

export default Settings;
