import LoginForm from './LoginForm';
import QuickTools from './QuickTools';
import PopularPosts from './PopularPosts';

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-1/3 space-y-8 lg:sticky lg:top-8">
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Üye Paneli</h2>
        <LoginForm />
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Hızlı Araçlar</h2>
        <QuickTools />
      </div>

      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Popüler Yazılar</h2>
        <PopularPosts />
      </div>
    </aside>
  );
} 