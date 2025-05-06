import { Component, Input, Output, EventEmitter, OnInit, OnChanges, AfterViewChecked, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { createHighlighter } from 'shiki';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-json-modal',
  templateUrl: './json-modal.component.html',
  styleUrls: ['./json-modal.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class JsonModalComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() jsonData: any;
  @Input() isOpen: boolean = false;
  @Output() closeEvent = new EventEmitter<void>();

  @ViewChild('codeContainer') codeContainer!: ElementRef;

  highlightedCode: string = '';
  isCopied: boolean = false;

  constructor() {}

  async ngOnInit() {
    // Initial highlighting will be done when the modal is first opened
    if (this.jsonData) {
      await this.highlightJson();
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['jsonData']) {
      // Highlight whenever jsonData changes
      await this.highlightJson();
    }

    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      // Ensure code is highlighted when modal is opened
      await this.highlightJson();
    }
  }

  async highlightJson() {
    console.log('highlightJson called with data:', this.jsonData);

    if (!this.jsonData) {
      console.error('jsonData is null or undefined');
      // Set a default message when no data is available
      this.highlightedCode = `<pre style="background-color: #0d1117; color: #e6edf3; padding: 16px; border-radius: 4px;"><code>No JSON data available</code></pre>`;
      return;
    }

    try {
      // Ensure jsonData is properly converted to a string if it's an object
      let jsonToFormat = this.jsonData;

      // If jsonData is already a string, parse it to ensure it's valid JSON
      if (typeof this.jsonData === 'string') {
        try {
          jsonToFormat = JSON.parse(this.jsonData);
        } catch (parseError) {
          console.error('Error parsing JSON string:', parseError);
          // If it's not valid JSON, use it as is
          jsonToFormat = this.jsonData;
        }
      }

      // Format the JSON
      const formattedJson = JSON.stringify(jsonToFormat, null, 2);
      console.log('Formatted JSON:', formattedJson);

      try {
        // Use createHighlighter from shiki
        const highlighter = await createHighlighter({
          themes: ['github-dark'],
          langs: ['json']
        });

        const highlighted = highlighter.codeToHtml(formattedJson, {
          lang: 'json',
          theme: 'github-dark'
        });

        this.highlightedCode = highlighted;
        console.log('Highlighted code generated successfully with highlighter');

        // Ensure the code container is updated in the next change detection cycle
        setTimeout(() => {
          if (this.codeContainer && this.codeContainer.nativeElement) {
            this.codeContainer.nativeElement.innerHTML = this.highlightedCode;
          }
        }, 0);
      } catch (highlighterError) {
        console.error('Error with highlighter:', highlighterError);

        // Fallback to pre-formatted JSON if highlighting fails
        const safeJson = JSON.stringify(jsonToFormat, null, 2)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        this.highlightedCode = `<pre style="background-color: #0d1117; color: #e6edf3; padding: 16px; border-radius: 4px;"><code>${safeJson}</code></pre>`;
        console.log('Fallback formatting applied due to highlighter error');

        // Ensure the code container is updated in the next change detection cycle
        setTimeout(() => {
          if (this.codeContainer && this.codeContainer.nativeElement) {
            this.codeContainer.nativeElement.innerHTML = this.highlightedCode;
          }
        }, 0);
      }
    } catch (error) {
      console.error('Error highlighting JSON:', error);
      // Fallback to pre-formatted JSON if highlighting fails
      try {
        const safeJson = JSON.stringify(this.jsonData, null, 2)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        this.highlightedCode = `<pre style="background-color: #0d1117; color: #e6edf3; padding: 16px; border-radius: 4px;"><code>${safeJson}</code></pre>`;
        console.log('Fallback formatting applied');

        // Ensure the code container is updated in the next change detection cycle
        setTimeout(() => {
          if (this.codeContainer && this.codeContainer.nativeElement) {
            this.codeContainer.nativeElement.innerHTML = this.highlightedCode;
          }
        }, 0);
      } catch (fallbackError) {
        console.error('Error in fallback formatting:', fallbackError);
        this.highlightedCode = `<pre style="background-color: #0d1117; color: #e6edf3; padding: 16px; border-radius: 4px;"><code>Error formatting JSON data</code></pre>`;

        // Ensure the code container is updated in the next change detection cycle
        setTimeout(() => {
          if (this.codeContainer && this.codeContainer.nativeElement) {
            this.codeContainer.nativeElement.innerHTML = this.highlightedCode;
          }
        }, 0);
      }
    }
  }

  copyToClipboard() {
    if (!this.jsonData) {
      console.error('Cannot copy: jsonData is null or undefined');
      return;
    }

    try {
      const jsonString = JSON.stringify(this.jsonData, null, 2);

      navigator.clipboard.writeText(jsonString).then(() => {
        this.isCopied = true;
        console.log('JSON copied to clipboard successfully');

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          this.isCopied = false;
        }, 2000);
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    } catch (error) {
      console.error('Error stringifying JSON for clipboard:', error);
    }
  }

  closeModal() {
    this.isOpen = false;
    this.closeEvent.emit();
  }

  ngAfterViewChecked() {
    // Check if the modal is open and the code container exists
    if (this.isOpen && this.codeContainer && this.codeContainer.nativeElement) {
      // Check if the code container has content
      const content = this.codeContainer.nativeElement.innerHTML;
      if (!content || content.trim() === '' || content.indexOf('No JSON data available') > -1) {
        console.log('Code container is empty or showing default message after view check');

        // If we have jsonData but the container is empty, force a re-highlight
        if (this.jsonData) {
          // If the container is empty but we have highlighted code, try to set it again
          if (this.highlightedCode && this.highlightedCode.trim() !== '') {
            console.log('Attempting to re-apply highlighted code to empty container');
            // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
            setTimeout(() => {
              this.codeContainer.nativeElement.innerHTML = this.highlightedCode;
            }, 0);
          } else {
            // If we have data but no highlighted code, try to highlight again
            console.log('No highlighted code but jsonData exists, re-highlighting');
            setTimeout(() => {
              this.highlightJson();
            }, 0);
          }
        }
      } else {
        // Log success if content is present
        console.log('Code container has content after view check');
      }
    }
  }
}
