use leptos::*;

#[component]
pub fn HomePage() -> impl IntoView {
    view! {
        <div class="container mx-auto px-4 py-16 max-w-4xl">
            <div class="text-center mb-12">
                <h1 class="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                    "⏰ Timeblocking"
                </h1>
                <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    "그룹 일정 조율을 위한 가장 쉬운 방법"
                </p>
                <a
                    href="/create"
                    class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                    "새 투표 만들기"
                </a>
            </div>

            <div class="grid md:grid-cols-3 gap-8 mb-16">
                <FeatureCard
                    icon="📅"
                    title="날짜 범위 선택"
                    description="시작일과 종료일을 선택하면 자동으로 모든 날짜가 생성됩니다"
                />
                <FeatureCard
                    icon="✅"
                    title="간편한 투표"
                    description="달력에서 가능한 날짜를 클릭하기만 하면 됩니다"
                />
                <FeatureCard
                    icon="📊"
                    title="실시간 결과"
                    description="히트맵으로 가장 인기있는 날짜를 한눈에 확인하세요"
                />
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md">
                <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    "사용 방법"
                </h2>
                <ol class="space-y-4 text-gray-700 dark:text-gray-300">
                    <li class="flex items-start">
                        <span class="font-bold text-blue-600 mr-3">"1."</span>
                        <span>"투표 제목과 날짜 범위를 입력하여 새 투표를 만듭니다"</span>
                    </li>
                    <li class="flex items-start">
                        <span class="font-bold text-blue-600 mr-3">"2."</span>
                        <span>"생성된 링크를 참여자들과 공유합니다"</span>
                    </li>
                    <li class="flex items-start">
                        <span class="font-bold text-blue-600 mr-3">"3."</span>
                        <span>"참여자들이 가능한 날짜를 선택합니다"</span>
                    </li>
                    <li class="flex items-start">
                        <span class="font-bold text-blue-600 mr-3">"4."</span>
                        <span>"가장 많은 투표를 받은 날짜를 확인하고 일정을 확정합니다"</span>
                    </li>
                </ol>
            </div>
        </div>
    }
}

#[component]
fn FeatureCard(icon: &'static str, title: &'static str, description: &'static str) -> impl IntoView {
    view! {
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
            <div class="text-4xl mb-3">{icon}</div>
            <h3 class="text-lg font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
            <p class="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    }
}
