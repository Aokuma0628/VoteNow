/**
 * VoteNow投票アプリ - 共通JavaScript機能
 * テーマ管理、アニメーション、ユーティリティ関数
 */

// グローバル設定
const VoteNowConfig = {
  ANIMATION_DELAY: 50, // アニメーション遅延（ミリ秒）
  THEME_STORAGE_KEY: 'votenow-theme',
  AUTO_SAVE_DELAY: 1000, // 自動保存遅延
  API_TIMEOUT: 5000, // API タイムアウト
};

// テーマ管理クラス
class ThemeManager {
  constructor() {
    this.isDark = this.loadTheme();
    this.themeToggle = null;
    this.themeIcon = null;
    this.init();
  }

  init() {
    this.bindElements();
    this.applyTheme();
    this.setupEventListeners();
  }

  bindElements() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.themeIcon = document.getElementById('theme-icon');
  }

  setupEventListeners() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // システムテーマ変更の監視
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!this.hasStoredTheme()) {
          this.isDark = e.matches;
          this.applyTheme();
        }
      });
    }
  }

  loadTheme() {
    const stored = localStorage.getItem(VoteNowConfig.THEME_STORAGE_KEY);
    if (stored) {
      return stored === 'dark';
    }
    // システム設定から取得
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  saveTheme() {
    localStorage.setItem(VoteNowConfig.THEME_STORAGE_KEY, this.isDark ? 'dark' : 'light');
  }

  hasStoredTheme() {
    return localStorage.getItem(VoteNowConfig.THEME_STORAGE_KEY) !== null;
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    this.saveTheme();
    this.applyTheme();
  }

  applyTheme() {
    const body = document.body;

    // ボディクラスの更新
    if (this.isDark) {
      body.className = body.className
        .replace(
          /bg-gradient-to-br from-gray-50 via-stone-50 to-slate-50/,
          'bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900',
        )
        .replace(/text-stone-800/, 'text-slate-100');
    } else {
      body.className = body.className
        .replace(
          /bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900/,
          'bg-gradient-to-br from-gray-50 via-stone-50 to-slate-50',
        )
        .replace(/text-slate-100/, 'text-stone-800');
    }

    // テーマアイコンの更新
    if (this.themeIcon) {
      this.themeIcon.setAttribute('data-lucide', this.isDark ? 'sun' : 'moon');
    }

    // 動的テーマクラスの追加/削除
    this.updateDynamicElements();

    // Lucide iconsの再初期化
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // カスタムイベントの発火
    window.dispatchEvent(
      new CustomEvent('themeChanged', {
        detail: { isDark: this.isDark },
      }),
    );
  }

  updateDynamicElements() {
    // カード要素の更新
    const cards = document.querySelectorAll(
      '.poll-card, .stat-card, [class*="bg-white"], [class*="bg-slate-8"]',
    );
    cards.forEach(card => {
      if (this.isDark) {
        card.classList.add('dark');
      } else {
        card.classList.remove('dark');
      }
    });

    // 投票オプションの更新
    const options = document.querySelectorAll('.vote-option');
    options.forEach(option => {
      if (this.isDark) {
        option.classList.add('dark');
      } else {
        option.classList.remove('dark');
      }
    });

    // プログレスバーの更新
    const progressBars = document.querySelectorAll('.vote-progress, .result-bar');
    progressBars.forEach(bar => {
      if (this.isDark) {
        bar.classList.add('dark');
      } else {
        bar.classList.remove('dark');
      }
    });

    // ステータスバッジの更新
    const badges = document.querySelectorAll('.status-badge');
    badges.forEach(badge => {
      if (this.isDark) {
        badge.classList.add('dark');
      } else {
        badge.classList.remove('dark');
      }
    });
  }

  getCurrentTheme() {
    return this.isDark ? 'dark' : 'light';
  }
}

// アニメーション管理クラス
class AnimationManager {
  static slideInElements(selector, delay = VoteNowConfig.ANIMATION_DELAY) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      element.style.animationDelay = `${index * delay}ms`;
      element.classList.add('slide-in');
    });
  }

  static fadeInElements(selector, delay = VoteNowConfig.ANIMATION_DELAY) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      element.style.animationDelay = `${index * delay}ms`;
      element.classList.add('fade-in');
    });
  }

  static animateProgressBar(element, targetWidth, duration = 800) {
    if (!element) return;

    element.style.width = '0%';
    element.style.transition = `width ${duration}ms ease-out`;

    // 次のフレームで実行
    requestAnimationFrame(() => {
      element.style.width = `${targetWidth}%`;
    });
  }

  static shakeElement(element) {
    if (!element) return;

    element.classList.add('shake');
    setTimeout(() => {
      element.classList.remove('shake');
    }, 500);
  }

  static pulseElement(element, duration = 2000) {
    if (!element) return;

    element.classList.add('pulse-animation');
    setTimeout(() => {
      element.classList.remove('pulse-animation');
    }, duration);
  }
}

// ユーティリティクラス
class VoteNowUtils {
  // 時間フォーマット
  static formatTimeRemaining(timeObj) {
    if (timeObj.expired) return '期限切れ';

    const { days, hours, minutes } = timeObj;

    if (days > 0) {
      return `残り${days}日${hours > 0 ? hours + '時間' : ''}`;
    } else if (hours > 0) {
      return `残り${hours}時間${minutes > 0 ? minutes + '分' : ''}`;
    } else if (minutes > 0) {
      return `残り${minutes}分`;
    } else {
      return '間もなく終了';
    }
  }

  // 日付フォーマット
  static formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    return new Date(date).toLocaleDateString('ja-JP', { ...defaultOptions, ...options });
  }

  // 相対時間フォーマット
  static formatRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    if (days < 7) return `${days}日前`;

    return this.formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // 数値フォーマット
  static formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // パーセンテージ計算
  static calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  // デバウンス関数
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // スロットル関数
  static throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // ローカルストレージのセーフアクセス
  static setLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn('LocalStorage保存エラー:', error);
      return false;
    }
  }

  static getLocalStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('LocalStorage読み込みエラー:', error);
      return defaultValue;
    }
  }

  // URL パラメータ取得
  static getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // エラーハンドリング
  static handleError(error, context = '') {
    console.error(`VoteNow Error ${context}:`, error);

    // ユーザーへの通知（必要に応じてカスタマイズ）
    const message = error.message || 'エラーが発生しました';
    this.showNotification(message, 'error');
  }

  // 通知表示
  static showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;

    // タイプ別スタイル
    const styles = {
      info: 'bg-blue-500 text-white',
      success: 'bg-green-500 text-white',
      warning: 'bg-yellow-500 text-black',
      error: 'bg-red-500 text-white',
    };

    notification.className += ` ${styles[type] || styles.info}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // アニメーション表示
    requestAnimationFrame(() => {
      notification.classList.remove('translate-x-full');
    });

    // 自動削除
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  }

  // フォームバリデーション
  static validateForm(formData, rules) {
    const errors = {};

    for (const [field, rule] of Object.entries(rules)) {
      const value = formData[field];

      if (rule.required && (!value || value.trim() === '')) {
        errors[field] = rule.message || `${field}は必須です`;
        continue;
      }

      if (value && rule.minLength && value.length < rule.minLength) {
        errors[field] = rule.message || `${field}は${rule.minLength}文字以上入力してください`;
      }

      if (value && rule.maxLength && value.length > rule.maxLength) {
        errors[field] = rule.message || `${field}は${rule.maxLength}文字以内で入力してください`;
      }

      if (value && rule.pattern && !rule.pattern.test(value)) {
        errors[field] = rule.message || `${field}の形式が正しくありません`;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

// 投票操作クラス
class VotingOperations {
  static castVote(pollId, optionIds, callback) {
    // モックAPI呼び出しのシミュレーション
    setTimeout(() => {
      try {
        const poll = window.VoteNowData.mockPolls.find(p => p.id === pollId);
        if (!poll) {
          throw new Error('投票が見つかりません');
        }

        if (poll.status !== window.VoteNowData.POLL_STATUS.ACTIVE) {
          throw new Error('この投票は終了しています');
        }

        // 投票の実行（モック）
        optionIds.forEach(optionId => {
          const option = poll.options.find(o => o.id === optionId);
          if (option) {
            option.votes += 1;
            poll.totalVotes += 1;
          }
        });

        // 投票履歴の更新
        const vote = {
          pollId,
          [poll.allowMultiple ? 'optionIds' : 'optionId']: poll.allowMultiple
            ? optionIds
            : optionIds[0],
          votedAt: new Date(),
        };
        window.VoteNowData.userVoteHistory.votes.push(vote);

        callback(null, { success: true, poll });
      } catch (error) {
        callback(error);
      }
    }, 500); // API遅延のシミュレーション
  }

  static createPoll(pollData, callback) {
    setTimeout(() => {
      try {
        const newPoll = {
          id: Date.now().toString(),
          ...pollData,
          status: window.VoteNowData.POLL_STATUS.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalVotes: 0,
          createdBy: {
            id: 'current-user',
            name: 'あなた',
            avatar: null,
          },
          options: pollData.options.map((text, index) => ({
            id: `opt${Date.now()}_${index}`,
            text,
            description: '',
            votes: 0,
          })),
        };

        window.VoteNowData.mockPolls.unshift(newPoll);
        callback(null, { success: true, poll: newPoll });
      } catch (error) {
        callback(error);
      }
    }, 800);
  }

  static deletePoll(pollId, callback) {
    setTimeout(() => {
      try {
        const index = window.VoteNowData.mockPolls.findIndex(p => p.id === pollId);
        if (index === -1) {
          throw new Error('投票が見つかりません');
        }

        window.VoteNowData.mockPolls.splice(index, 1);
        callback(null, { success: true });
      } catch (error) {
        callback(error);
      }
    }, 300);
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  // テーママネージャーの初期化
  window.VoteNowTheme = new ThemeManager();

  // アニメーションの適用
  AnimationManager.slideInElements('.poll-card, .stat-card');
  AnimationManager.fadeInElements('[data-fade-in]');

  // Lucide アイコンの初期化
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// グローバル公開
window.VoteNowConfig = VoteNowConfig;
window.ThemeManager = ThemeManager;
window.AnimationManager = AnimationManager;
window.VoteNowUtils = VoteNowUtils;
window.VotingOperations = VotingOperations;
