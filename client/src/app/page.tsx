import WriteDailyEditor from '@/components/Editor';
import PrivateNavbar from '@/components/Navbar/PrivateNavbar';

export default function Home() {
    return (
        <main className="my-5 mx-5">
            <PrivateNavbar />
            <h1 className="text-2xl">Your plate Editor is Here</h1>
            <WriteDailyEditor />
        </main>
    );
}
