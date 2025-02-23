import MeetingList from './components/Meeting/MeetingList';
import CreateMeeting from './components/Meeting/CreateMeeting';

// In your routes configuration:
<Route path="/meetings" element={<MeetingList />} />
<Route path="/meetings/create" element={<CreateMeeting />} /> 