import { Passkeys as LaravelPasskeys } from '@laravel/passkeys'

declare global {
    var Passkeys: typeof LaravelPasskeys
}
