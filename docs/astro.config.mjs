// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'HealthEase Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Handleiding',
					items: [
						{ label: 'Overzicht', slug: 'handleiding' },
						{ label: 'Voor klanten', slug: 'handleiding/klant' },
						{ label: 'Voor apotheken', slug: 'handleiding/apotheek' },
						{ label: 'Voor admins', slug: 'handleiding/admin' },
					],
				},
				{
					label: 'Technische documentatie',
					items: [
						{ label: 'Overzicht & architectuur', slug: 'technisch' },
						{ label: 'Project- en mappenstructuur', slug: 'technisch/structuur' },
						{ label: 'Data & authenticatie', slug: 'technisch/data-en-auth' },
						{ label: 'Ontwikkelen, testen & deployen', slug: 'technisch/ontwikkelen' },
						{ label: 'Bekende aandachtspunten', slug: 'technisch/aandachtspunten' },
					],
				},
			],
		}),
	],
});
