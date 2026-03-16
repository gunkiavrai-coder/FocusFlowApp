# FocusFlow AI

> Organise ta journée selon ton énergie. Travaille mieux, pas plus.

FocusFlow AI est une app de productivité pour freelances qui génère un planning optimal basé sur ton niveau d'énergie du jour — propulsée par Claude AI.

## Features

- **Vibe Check** — Évalue ton énergie de 1 à 5 avant de commencer ta journée
- **Planning IA** — Claude analyse tes tâches et génère un planning Deep Work / Shallow Work optimal
- **Task Manager** — Ajoute, complète et supprime tes tâches avec persistance cloud
- **Auth sécurisée** — Inscription / connexion via Supabase, données isolées par utilisateur
- **Multi-plateforme** — Web, iOS et Android depuis un seul codebase

## Stack

| Couche | Techno |
|--------|--------|
| Frontend | React Native + Expo Router v3 |
| Styles | NativeWind v4 (Tailwind CSS) |
| Backend | Supabase (Auth + PostgreSQL + RLS) |
| IA | Claude claude-opus-4-6 via Edge Function |
| Déploiement web | Vercel |
| Déploiement mobile | EAS Build (Expo) |

## Getting Started

### Prérequis

- Node.js 18+
- Compte [Supabase](https://supabase.com) (gratuit)
- Compte [Anthropic](https://console.anthropic.com) pour l'IA (optionnel)

### Installation

```bash
# Cloner le repo
git clone https://github.com/gunkiavrai-coder/FocusFlowApp.git
cd FocusFlowApp

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Remplis les valeurs dans .env

# Lancer en développement
npx expo start --web
```

### Configuration Supabase

1. Crée un projet sur [supabase.com](https://supabase.com)
2. Exécute `supabase/schema.sql` dans le SQL Editor
3. Copie l'URL et l'Anon Key dans ton `.env`

### Activer l'IA Claude (optionnel)

```bash
# Déployer l'Edge Function
npx supabase functions deploy ai-plan --project-ref TON_PROJECT_REF

# Configurer la clé Anthropic
npx supabase secrets set ANTHROPIC_API_KEY=ta_cle

# Activer dans .env
EXPO_PUBLIC_USE_AI=true
```

## Déploiement

### Web (Vercel)

1. Importe le repo sur [vercel.com](https://vercel.com)
2. Ajoute les variables d'environnement :
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_USE_AI` (optionnel)
3. Vercel build automatiquement à chaque push

### Mobile (EAS Build)

```bash
# Installer EAS CLI
npm install -g eas-cli

# Build preview (APK Android)
eas build --platform android --profile preview

# Build production
eas build --platform all --profile production
```

## Structure du projet

```
FocusFlowApp/
├── app/
│   ├── (app)/          # Écrans principaux (tabs)
│   │   ├── index.tsx   # Dashboard
│   │   ├── plan.tsx    # Planning IA
│   │   └── settings.tsx
│   ├── (auth)/         # Auth screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── _layout.tsx     # Root layout + AuthGate
├── components/
│   ├── tasks/          # TaskCard, TaskList
│   ├── ui/             # Button, Card, Badge
│   └── vibe/           # VibeSelector
├── lib/
│   ├── claude.ts       # generatePlan() + algo local
│   ├── supabase.ts     # Client Supabase
│   └── hooks/          # useTasks, useSession
└── supabase/
    ├── schema.sql       # DB schema + RLS
    └── functions/
        └── ai-plan/    # Edge Function Claude AI
```

## Roadmap

- [ ] Notifications de rappel
- [ ] Mode Pomodoro intégré
- [ ] Stats hebdomadaires
- [ ] Export planning (PDF / Notion)
- [ ] Plan Pro — tâches illimitées + sync multi-appareils

## Licence

MIT
