export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* ヘッダー */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Next.js App</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Next.js with TypeScript and shadcn/ui
          </p>
        </header>

        {/* メインコンテンツ */}
        <div className="text-center">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome!</h2>
            <p className="text-gray-600 mb-6">Next.js アプリケーションへようこそ</p>
          </div>
        </div>

        {/* 技術スタック */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">技術スタック</h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="bg-white px-3 py-1 rounded-full border">Next.js 15</span>
            <span className="bg-white px-3 py-1 rounded-full border">TypeScript</span>
            <span className="bg-white px-3 py-1 rounded-full border">Tailwind CSS</span>
            <span className="bg-white px-3 py-1 rounded-full border">shadcn/ui</span>
          </div>
        </div>
      </div>
    </div>
  );
}
