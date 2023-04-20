import passworder from "@metamask/browser-passworder";
import CacheAuth from "./entities/CacheAuth";
import Vault from "./entities/Vault";

export default class Auth {
  #isUnlocked: boolean;
  #password: string | undefined;

  private static instance: Auth;

  private constructor() {
    this.#isUnlocked = false;
    this.#password = undefined;
  }

  public static getInstance() {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  static get isUnlocked() {
    return Auth.getInstance().#isUnlocked;
  }

  static set isUnlocked(isUnlocked: boolean) {
    Auth.getInstance().#isUnlocked = isUnlocked;
  }

  static get password() {
    return Auth.getInstance().#password;
  }

  static set password(password: string | undefined) {
    Auth.getInstance().#password = password;
  }

  static validate() {
    if (!Auth.isUnlocked || !Auth.password) {
      throw new Error("login_required");
    }
  }

  static async loadAuthFromCache(salt: string) {
    const { password, isUnlocked } = CacheAuth.getInstance();
    // AUDIT: when cacheauth expired should sign out directly, why is it checking if password is falsy?
    if (!password || (await CacheAuth.hasExpired())) {
      Auth.getInstance().signOut();
      return;
    }
    const decrypted = await passworder.decrypt(salt, password);
    Auth.password = decrypted as string;
    Auth.isUnlocked = isUnlocked;
  }

  // AUDIT: should be performing loadAuthFromCache before Auth.validate(); or validate should perform loadAuthFromCache.
  async decryptVault(vault: string) {
    Auth.validate();
    return passworder.decrypt(this.#password as string, vault);
  }

  async encryptVault(vault: typeof Vault) {
    Auth.validate();
    return passworder.encrypt(this.#password as string, vault);
  }

  async signUp(password: string) {
    this.#password = password;
    this.#isUnlocked = true;
  }

  async signIn(password: string, vault: string) {
    try {
      const decryptedVault = (await passworder.decrypt(
        password,
        vault
      )) as Vault;
      // AUDIT: in a future version check if the decrypted vault is valid instead of just checking if it is falsy, could present problems when upgrading passworder
      if (!decryptedVault) {
        throw new Error("invalid_credentials");
      }
      this.#password = password;
      this.#isUnlocked = true;
    } catch (error) {
      this.signOut();
      throw error;
    }
  }

  signOut() {
    this.#isUnlocked = false;
    this.#password = undefined;
  }

  async encryptBackup(recoveryPhrase: string) {
    try {
      if (!this.#password) throw new Error("login_required");
      // AUDIT: passworder.encrypt(password, data)
      return passworder.encrypt(recoveryPhrase, this.#password);
    } catch (error) {
      // console.error(error);
      // AUDIT: missleading error, should be failed_to_encrypt_backup
      throw new Error("failed_to_save_backup");
    }
  }

  static async decryptBackup(backup: string, recoveryPhrase: string) {
    try {
      return passworder.decrypt(recoveryPhrase, backup);
    } catch (error) {
      // console.error(error);
      // AUDIT: missleading error, should be failed_to_decrypt_backup
      throw new Error("failed_to_restore_backup");
    }
  }

  static async generateSaltedHash(salt: string, password: string) {
    return passworder.encrypt(salt, password);
  }
}
