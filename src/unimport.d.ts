export {}
declare global {
  const pushNotify: typeof import('C:\\Users\\Aleksandr\\Desktop\\povs_3_front\\src\\main')['pushNotify']
}
// for vue template auto import
import { UnwrapRef } from 'vue'
declare module 'vue' {
  interface ComponentCustomProperties {
    readonly pushNotify: UnwrapRef<typeof import('C:\\Users\\Aleksandr\\Desktop\\povs_3_front\\src\\main.ts')['pushNotify']>
  }
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    readonly pushNotify: UnwrapRef<typeof import('C:\\Users\\Aleksandr\\Desktop\\povs_3_front\\src\\main.ts')['pushNotify']>
  }
}
