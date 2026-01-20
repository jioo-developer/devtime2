"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR에서는 클라이언트에서 즉시 refetch하는 것을 피하기 위해
        // staleTime을 0보다 크게 설정하는 것이 좋다.
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    //서버
    return makeQueryClient();
    // 매번 새로운 queryClient를 만든다.
  }

  // 클라이언트
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
    // queryClient가 존재하지 않을 경우에만 새로운 queryClient를 만든다.
  }

  return browserQueryClient;
  // QueryClient 객체를 여러 번 생성하는 대신, 한 번 생성한 후 계속 사용
}

// 서버와 클라이언트 queryclient를 따로 만듬

export default function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: queryClient를 useState를 사용하여 초기화 하면 안된다.
  // suspense boundary가 없을 경우 React의 렌더링이 중단될 수도 있고
  // queryClient 자체를 폐기할 수 도 있다.
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
