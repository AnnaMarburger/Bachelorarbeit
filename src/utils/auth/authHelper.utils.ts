import { ref, onMounted, onUnmounted } from 'vue';
import { Auth } from '../../services/AuthService';

export function useAuthHelper() {
  const isAuthenticated = ref(false);

  onMounted(() => {
    const subscription = Auth.Instance.isAuthenticated$.subscribe(
      (isAuth: boolean) => {
        isAuthenticated.value = isAuth;
      },
    );

    // Consider adding onUnmounted lifecycle hook to unsubscribe
    // from the observable to prevent memory leaks
    onUnmounted(() => {
      subscription.unsubscribe();
    });
  });

  return {
    isAuthenticated,
  };
}
