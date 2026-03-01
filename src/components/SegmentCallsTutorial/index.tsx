import React from 'react';
import { Card } from '../ui/Card';

export const SegmentCallsTutorial: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="p-6 holographic-card">
        <div className="prose prose-invert max-w-none">
          <h3 className="text-2xl font-bold gradient-text">📋 Segment Calls Tutorial</h3>

          <p className="text-text-secondary">
            Segment calls are essential for maintaining special effects when replacing models in Zelda: Ocarina of Time.
            When you export models using the Fast64 plugin, these crucial segment settings are lost and must be restored
            to prevent broken visual effects in your custom models.
          </p>

          <div className="my-4 rounded-lg border-l-4 border-warning bg-warning/10 p-4">
            <strong className="text-warning">Important:</strong> Your new model's material structure must match the original. Always reference the imported
            original model to ensure proper compatibility. Mismatched structures will result in broken models.
          </div>

          <h4 className="mt-6 text-xl font-bold text-primary">Manual Method</h4>

          <div className="my-3 rounded-lg bg-surface-elevated p-3">
            <strong>Step 1:</strong> Open each exported material file and locate the end of the display list.
          </div>

          <div className="my-3 rounded-lg bg-surface-elevated p-3">
            <strong>Step 2:</strong> Find this closing tag at the end of the material:
          </div>

          <pre className="my-3 rounded-lg bg-background p-4 text-sm"><code className="text-cyan">&lt;EndDisplayList/&gt;</code></pre>

          <div className="my-3 rounded-lg bg-surface-elevated p-3">
            <strong>Step 3:</strong> Insert the segment call immediately before the EndDisplayList tag:
          </div>

          <pre className="my-3 rounded-lg bg-background p-4 text-sm"><code className="text-cyan">&lt;CallDisplayList Path="&gt;0xZZ000000"/&gt;</code></pre>

          <div className="my-4 rounded-lg border-l-4 border-primary bg-primary/10 p-4">
            The specific segment value (0xZZ000000) varies by model. Use the Objects and Scenes tabs in this database
            to find the correct segment call for your specific model.
          </div>

          <div className="my-6 text-center text-text-muted">• • •</div>

          <h4 className="mt-6 text-xl font-bold text-fuchsia">Automated Method</h4>

          <p className="text-text-secondary">
            For faster processing, use the automated terminal program available for Windows and Linux:{' '}
            <a
              href="https://drive.google.com/drive/folders/1ho-0EbIEAO4CInZcMsVCfzQEJYvYKuSY"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Download Segment Integrator Tools
            </a>
          </p>

          <p className="mt-4 font-semibold text-text-primary">Windows Usage:</p>
          <div className="my-3 rounded-lg bg-surface-elevated p-3">
            Drag and drop your Objects folder directly onto the executable file.
          </div>

          <p className="mt-4 font-semibold text-text-primary">Linux Usage:</p>
          <div className="my-3 rounded-lg bg-surface-elevated p-3">
            Set the file as executable, then run from the tool's directory:
          </div>

          <pre className="my-3 rounded-lg bg-background p-4 text-sm"><code>./Segment_Integrator_Linux "path/to/exported/objects/"</code></pre>

          <em className="text-text-muted">
            <strong>Tool Limitations:</strong> Currently only supports Objects (not Scenes). Models with multiple segment values
            must be handled manually - the tool will display an error and prompt you to use the manual method above.
          </em>
        </div>
      </Card>
    </div>
  );
};

export default SegmentCallsTutorial;
