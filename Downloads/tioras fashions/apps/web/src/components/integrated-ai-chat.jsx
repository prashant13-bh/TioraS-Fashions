
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAnimatedText } from '@/hooks/use-animated-text';
import { useIntegratedAi } from '@/hooks/use-integrated-ai';

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const getImageKey = file => `${file.name}:${file.size}:${file.lastModified}`;

export default function IntegratedAiChat({ onMessagesChange, externalPrompt, onPromptSent }) {
	const [input, setInput] = useState('');
	const [selectedImages, setSelectedImages] = useState([]);
	const { messages, isStreaming, isLoadingHistory, sendMessage, clearMessages } = useIntegratedAi();
	const messagesEndRef = useRef(null);
	const fileInputRef = useRef(null);

	const imagePreviews = useMemo(() => selectedImages.map(file => ({
		key: getImageKey(file),
		file,
		url: URL.createObjectURL(file),
	})), [selectedImages]);

	useEffect(() => () => {
		imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
	}, [imagePreviews]);

	const lastMessage = messages[messages.length - 1];
	const isLastMessageStreaming = isStreaming && lastMessage?.role === 'assistant';
	const animatedText = useAnimatedText(isLastMessageStreaming ? lastMessage.content : '');

	useEffect(() => {
		const scrollToBottom = () => {
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollIntoView({
					behavior: 'smooth',
					block: 'end',
				});
			}
		};

		scrollToBottom();
	}, [messages]);

	// Expose messages to parent component
	useEffect(() => {
		if (onMessagesChange) {
			onMessagesChange(messages);
		}
	}, [messages, onMessagesChange]);

	// Handle external prompt submission
	useEffect(() => {
		if (externalPrompt && !isStreaming && !isLoadingHistory) {
			sendMessage(externalPrompt, []);
			if (onPromptSent) onPromptSent();
		}
	}, [externalPrompt, isStreaming, isLoadingHistory, sendMessage, onPromptSent]);

	const handleSubmit = useCallback((e) => {
		e.preventDefault();

		const trimmed = input.trim();

		if ((!trimmed && selectedImages.length === 0) || isStreaming) {
			return;
		}

		setInput('');
		sendMessage(trimmed, selectedImages);
		setSelectedImages([]);
	}, [input, selectedImages, isStreaming, sendMessage]);

	const handleImageSelect = useCallback((e) => {
		const files = Array.from(e.target.files || []);
		const validFiles = files.filter(file => VALID_IMAGE_TYPES.includes(file.type) && file.size <= MAX_IMAGE_SIZE);

		setSelectedImages((prev) => {
			const uniqueFilesMap = new Map(prev.map(file => [getImageKey(file), file]));
			validFiles.forEach(file => uniqueFilesMap.set(getImageKey(file), file));
			return Array.from(uniqueFilesMap.values()).slice(0, MAX_IMAGES);
		});

		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}, [fileInputRef]);

	const removeImage = useCallback((index) => {
		setSelectedImages(prev => prev.filter((_, i) => i !== index));
	}, []);

	return (
		<div className="flex flex-col h-full w-full">
			<div className="flex items-center justify-between p-4 border-b bg-muted/30">
				<h2 className="text-lg font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>AI Design Assistant</h2>
			{messages.length > 0 && (
				<button
					onClick={clearMessages}
					disabled={isStreaming}
					className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					Clear Chat
				</button>
			)}
			</div>

			<div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-background/50">
				{isLoadingHistory && (
					<div className="text-center text-sm text-muted-foreground py-4">Loading history...</div>
				)}
				{messages.length === 0 && !isLoadingHistory && (
					<div className="h-full flex flex-col items-center justify-center text-center opacity-50">
						<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
							<span className="text-2xl">✨</span>
						</div>
						<p className="text-lg font-medium" style={{ fontFamily: 'Playfair Display, serif' }}>Start designing</p>
						<p className="text-sm max-w-[250px] mt-2">Describe your vision or use the prompt builder above to begin.</p>
					</div>
				)}
				{messages.map((msg, i) => {
					const isLastStreamingMessage = isStreaming && i === messages.length - 1 && msg.role === 'assistant';
					const displayContent = isLastStreamingMessage ? animatedText : msg.content;

					return (
						<div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
							<div
								className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
									msg.role === 'user'
										? 'bg-primary text-primary-foreground rounded-tr-sm'
										: 'bg-card border border-border/50 text-card-foreground rounded-tl-sm'
								}`}
							>
								<p className="whitespace-pre-wrap text-[15px] leading-relaxed">{displayContent}</p>
								{msg.images?.map((url, j) => (
									<div key={j} className="mt-3 rounded-xl overflow-hidden border border-border/20 shadow-sm">
										<img
											src={url}
											alt="AI generated design"
											className="w-full h-auto object-cover"
										/>
									</div>
								))}
								{msg.role === 'assistant' && isStreaming && i === messages.length - 1 && !msg.content && (
									<div className="flex gap-1 mt-2">
										<span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
										<span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
										<span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
									</div>
								)}
							</div>
						</div>
					);
				})}
				<div ref={messagesEndRef} />
			</div>

			<div className="p-4 border-t bg-card">
				{selectedImages.length > 0 && (
					<div className="mb-3 flex gap-2 flex-wrap">
						{imagePreviews.map(({ key, file, url }, index) => (
							<div key={key} className="relative group">
								<img
									src={url}
									alt={file.name}
									className="w-16 h-16 object-cover rounded-lg border shadow-sm"
								/>
								<button
									type="button"
									onClick={() => removeImage(index)}
									className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
								>
									×
								</button>
							</div>
						))}
					</div>
				)}
				<form onSubmit={handleSubmit} className="flex gap-2 items-end">
					<input
						ref={fileInputRef}
						type="file"
						accept={VALID_IMAGE_TYPES.join(',')}
						multiple
						onChange={handleImageSelect}
						className="hidden"
						disabled={isStreaming || isLoadingHistory}
					/>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="rounded-xl border border-border bg-muted/50 p-3 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
						disabled={isStreaming || isLoadingHistory || selectedImages.length >= MAX_IMAGES}
						title="Upload reference image"
					>
						<svg xmlns="http://www.w3.org/0000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
					</button>
					<div className="relative flex-1">
						<textarea
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyDown={e => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleSubmit(e);
								}
							}}
							placeholder="Describe your design idea..."
							className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[48px] max-h-[120px]"
							rows={1}
							disabled={isStreaming || isLoadingHistory}
						/>
						<button
							type="submit"
							disabled={isStreaming || (!input.trim() && selectedImages.length === 0)}
							className="absolute right-2 bottom-2 rounded-lg bg-primary p-1.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							<svg xmlns="http://www.w3.org/0000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
