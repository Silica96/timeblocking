import Link from 'next/link';
import { Button } from '@/components/Button';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Timeblocking
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            가장 쉬운 일정 조율 서비스
          </p>
          <Link href="/create">
            <Button className="text-lg px-8 py-4">
              🗳️ 새 투표 만들기
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-semibold text-lg mb-2">빠른 생성</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              몇 번의 클릭으로 투표 생성
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">🔗</div>
            <h3 className="font-semibold text-lg mb-2">간편한 공유</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              링크 하나로 모든 참여자 초대
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold text-lg mb-2">실시간 결과</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              투표 현황을 바로 확인
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">이렇게 사용하세요</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">투표 생성</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  제목과 여러 날짜 옵션을 추가하여 투표를 만듭니다.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">링크 공유</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  생성된 링크를 카카오톡, 이메일 등으로 참여자들에게 공유합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">참여 및 투표</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  참여자들은 로그인 없이 가능한 날짜를 선택하여 투표합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">결과 확인</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  실시간으로 업데이트되는 투표 결과를 보고 최적의 날짜를 선택합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/create">
              <Button variant="outline">
                지금 시작하기 →
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>무료 • 로그인 불필요 • 간편한 일정 조율</p>
        </div>
      </div>
    </main>
  );
}
