import type { CvData } from '../../domain/entities/cv-data';
import type { TemplateConfig } from '../../domain/entities/template-config';
import { DEFAULT_TEMPLATE } from '../../domain/entities/template-config';

import { CvPreviewMain } from './cv-preview-main';
import { CvPreviewSidebar } from './cv-preview-sidebar';

interface CvPreviewProps {
  data: CvData;
  config?: TemplateConfig;
}

export function CvPreview({ data, config = DEFAULT_TEMPLATE }: CvPreviewProps) {
  return (
    <div
      className="cv-preview mx-auto bg-white text-black shadow-lg print:shadow-none"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '1cm 1.5cm 1cm 0.85cm',
        fontFamily: 'Inter, Tahoma, sans-serif',
        fontSize: '10pt',
        lineHeight: '1.1',
      }}
    >
      <div className="flex gap-[1.5cm]">
        <div
          className="shrink-0"
          style={{
            width: `${config.sidebarWidth}%`,
            backgroundColor: config.colors.sidebarBg,
            marginLeft: '-0.85cm',
            marginTop: '-1cm',
            marginBottom: '-1cm',
            paddingLeft: '0.85cm',
            paddingTop: '1.4cm',
            paddingRight: '0.4cm',
            minHeight: '297mm',
          }}
        >
          <CvPreviewSidebar data={data} config={config} />
        </div>
        <div className="flex-1 pt-0">
          <CvPreviewMain data={data} config={config} />
        </div>
      </div>
    </div>
  );
}
