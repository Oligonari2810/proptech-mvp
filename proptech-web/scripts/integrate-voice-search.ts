#!/usr/bin/env tsx
/**
 * 🎯 INTEGRACIÓN MASIVA DE VOICE SEARCH
 * Integra VoiceSearch en todas las páginas de búsqueda
 */
import fs from 'fs';
import path from 'path';

interface PageIntegration {
  path: string;
  searchComponentPattern: RegExp;
  integrationPoint: string;
}

class VoiceSearchIntegration {
  private pagesToIntegrate: PageIntegration[] = [
    {
      path: 'app/comprar/page.tsx',
      searchComponentPattern: /(SmartFilters|SearchFilters|Buscador)/i,
      integrationPoint: 'before-filters'
    },
    {
      path: 'app/alquilar/page.tsx',
      searchComponentPattern: /(SmartFilters|SearchFilters|Buscador)/i,
      integrationPoint: 'before-filters'
    },
    {
      path: 'app/vender/page.tsx',
      searchComponentPattern: /(PropertyForm|Formulario)/i,
      integrationPoint: 'header'
    },
    {
      path: 'app/invertir/page.tsx',
      searchComponentPattern: /(SmartFilters|SearchFilters)/i,
      integrationPoint: 'before-filters'
    }
  ];

  integrateVoiceSearch(): void {
    console.log('🎯 Integrating VoiceSearch across all search pages...\n');
    
    this.pagesToIntegrate.forEach(page => {
      this.integrateInPage(page);
    });
    
    console.log('\n✅ VoiceSearch integration completed!');
  }

  private integrateInPage(pageConfig: PageIntegration): void {
    const fullPath = path.join(process.cwd(), pageConfig.path);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Page not found: ${pageConfig.path}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Verificar si ya tiene VoiceSearch integrado
    if (content.includes('VoiceSearch') || content.includes('from') && content.includes('VoiceSearch')) {
      console.log(`✅ ${pageConfig.path}: Already has VoiceSearch`);
      return;
    }
    
    // Agregar import de VoiceSearch
    if (!content.includes("import { VoiceSearch }")) {
      const importMatch = content.match(/(import\s+.*from\s+['"].*['"];)/);
      if (importMatch) {
        const lastImport = importMatch[importMatch.length - 1];
        content = content.replace(
          lastImport,
          `${lastImport}\nimport { VoiceSearch } from '../components/VoiceSearch';`
        );
      } else {
        // Agregar después de 'use client'
        content = content.replace(
          /('use client'[^\n]*\n)/,
          "$1import { VoiceSearch } from '../components/VoiceSearch';\n"
        );
      }
    }
    
    // Agregar import de useToast si no existe
    if (!content.includes("useToast") && !content.includes("ToastNotification")) {
      const toastImport = "import { useToast } from '../components/ToastNotification';";
      if (!content.includes(toastImport)) {
        content = content.replace(
          /import { VoiceSearch }/,
          `import { useToast } from '../components/ToastNotification';\nimport { VoiceSearch }`
        );
      }
    }
    
    // Agregar hook useToast en el componente
    if (content.includes('export default function') && !content.includes('const { addToast }')) {
      const componentMatch = content.match(/(export\s+default\s+function\s+\w+\([^)]*\)\s*\{)/);
      if (componentMatch) {
        content = content.replace(
          componentMatch[0],
          `${componentMatch[0]}\n  const { addToast } = useToast();`
        );
      }
    }
    
    // Encontrar punto de integración
    const integrationPattern = this.getIntegrationPattern(pageConfig.integrationPoint);
    const match = content.match(integrationPattern);
    
    if (match) {
      const voiceSearchComponent = `
        {/* Voice Search Integration */}
        <div className="mb-4 flex items-center gap-2">
          <VoiceSearch
            onResult={(text) => {
              addToast({
                type: 'success',
                title: 'Voz reconocida',
                message: \`Buscando: "\${text}"\`,
                duration: 2000,
              });
              // Integrar con búsqueda existente
              if (typeof handleSearch === 'function') {
                handleSearch({ query: text });
              }
            }}
            onError={(error) => {
              addToast({
                type: 'error',
                title: 'Error en búsqueda por voz',
                message: error,
                duration: 4000,
              });
            }}
          />
        </div>
`;
      
      content = content.replace(match[0], voiceSearchComponent + '\n' + match[0]);
      fs.writeFileSync(fullPath, content);
      console.log(`✅ VoiceSearch integrated in ${pageConfig.path}`);
    } else {
      console.log(`⚠️  ${pageConfig.path}: Could not find integration point`);
    }
  }

  private getIntegrationPattern(integrationPoint: string): RegExp {
    const patterns = {
      'before-filters': /(<SmartFilters|<SearchFilters|<div[^>]*filters)/i,
      'header': /(<h1|<h2|<div[^>]*header)/i,
      'search-bar': /(<input[^>]*search|<SearchBar)/i
    };
    
    return patterns[integrationPoint as keyof typeof patterns] || /return\s*\(/;
  }
}

// Ejecutar integración
if (require.main === module) {
  const integrator = new VoiceSearchIntegration();
  integrator.integrateVoiceSearch();
}

export { VoiceSearchIntegration };

