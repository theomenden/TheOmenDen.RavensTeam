import * as React from 'react';
import '../../App.css';
export const ContentLayout: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
    return (
        <section>
            <div className="container">
                <div className="row">
                    <div className="col">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};
